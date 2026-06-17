/**
 * Transactional email for auth flows (magic link, password reset).
 *
 * Prefers the Cloudflare Email Service Workers binding (`send_email` → env.EMAIL),
 * which needs no API key or secret. Falls back to the Resend HTTP API when only
 * RESEND_API_KEY is set — e.g. local dev via .dev.vars, or before the sending
 * domain is onboarded in Cloudflare. No SvelteKit imports, so this is safe to
 * reuse from the migration script alongside auth-options.
 */

/** Minimal shape of the Cloudflare Email Service binding's send(). */
export interface EmailBinding {
	send(message: {
		from: string;
		to: string | string[];
		subject: string;
		html?: string;
		text?: string;
	}): Promise<{ messageId: string }>;
}

export interface EmailEnv {
	EMAIL?: EmailBinding;
	RESEND_API_KEY?: string;
}

export interface OutgoingEmail {
	to: string;
	subject: string;
	html: string;
	text?: string;
}

const FROM = 'tu itak re itak <login@aynu.org>';

/** Whether any email transport is configured (Cloudflare binding or Resend). */
export function emailEnabled(env: EmailEnv): boolean {
	return Boolean(env.EMAIL || env.RESEND_API_KEY);
}

/**
 * Send one transactional email. Uses the Cloudflare binding if bound, otherwise
 * Resend. Returns false when no transport is configured (caller decides what to
 * do); rethrows if the chosen transport itself errors.
 */
export async function sendEmail(env: EmailEnv, msg: OutgoingEmail): Promise<boolean> {
	if (env.EMAIL) {
		await env.EMAIL.send({
			from: FROM,
			to: msg.to,
			subject: msg.subject,
			html: msg.html,
			text: msg.text
		});
		return true;
	}
	if (env.RESEND_API_KEY) {
		await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.RESEND_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ from: FROM, to: msg.to, subject: msg.subject, html: msg.html })
		});
		return true;
	}
	return false;
}
