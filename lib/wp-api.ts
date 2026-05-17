// Server-only WordPress REST API base URL.
// Reads WP_API_URL (preferred, server-only) and falls back to the legacy
// NEXT_PUBLIC_WP_API_URL during migration. Once all deploys use WP_API_URL
// the fallback can be removed so the URL never leaks into the browser bundle.
export const WP_API = (
  process.env.WP_API_URL ||
  process.env.NEXT_PUBLIC_WP_API_URL ||
  'https://cmsodspr.sawangville.dev/wp-json'
).replace(/\/+$/, '');
