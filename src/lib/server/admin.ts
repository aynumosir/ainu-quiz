/** True if `email` is in the comma-separated ADMIN_EMAILS allowlist (env-driven,
 *  so admins are configured by deployment, never by client input). */
export function isAdminEmail(email: string | null | undefined, adminEmails: string | undefined): boolean {
	if (!email || !adminEmails) return false;
	const set = new Set(
		adminEmails
			.split(',')
			.map((e) => e.trim().toLowerCase())
			.filter(Boolean)
	);
	return set.has(email.toLowerCase());
}
