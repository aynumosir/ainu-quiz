import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// Cloudflare Workers: pages stay client-rendered (ssr=false in +layout.ts),
		// but +server.ts endpoints + hooks.server.ts run in the Worker, giving us a
		// server tier (Turso DB + better-auth). platformProxy makes `event.platform`
		// (bindings + .dev.vars) available under `vite dev` too.
		adapter: adapter({ platformProxy: { configPath: 'wrangler.jsonc', persist: false } })
	}
};

export default config;
