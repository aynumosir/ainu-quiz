// See https://svelte.dev/docs/kit/types#app.d.ts
import type { createAuth } from '$lib/server/auth';

type Auth = ReturnType<typeof createAuth>;
type Session = Auth['$Infer']['Session']['session'];
type User = Auth['$Infer']['Session']['user'];

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				TURSO_DATABASE_URL: string;
				TURSO_AUTH_TOKEN?: string;
				BETTER_AUTH_SECRET: string;
				BETTER_AUTH_URL?: string;
				GOOGLE_CLIENT_ID?: string;
				GOOGLE_CLIENT_SECRET?: string;
				GITHUB_CLIENT_ID?: string;
				GITHUB_CLIENT_SECRET?: string;
				RESEND_API_KEY?: string;
				ASSETS: Fetcher;
			};
			context: { waitUntil(promise: Promise<unknown>): void };
		}
	}
}

export {};
