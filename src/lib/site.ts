/** Canonical public origin for SEO metadata and the sitemap. */
export const SITE_URL = (
  import.meta.env["VITE_SITE_URL"] ??
  "http://localhost:3000"
).replace(/\/$/, "");

export const canonical = (path: string) => `${SITE_URL}${path}`;
