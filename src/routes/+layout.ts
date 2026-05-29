// tu itak runs entirely client-side (localStorage progress, no backend), so we
// render as a single-page app. adapter-static emits an index.html fallback.
export const ssr = false;
export const prerender = false;
