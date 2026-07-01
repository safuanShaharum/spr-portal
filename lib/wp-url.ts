// WP on the SPR server emits media/file URLs as https://<internal-host>/wp-...
// (self-signed cert / wrong host) which the browser cannot load. Make any WP
// media/file URL root-relative so it loads from the portal's own origin (nginx
// routes /wp-content to WP). Generic: strips scheme+host from any /wp-* URL,
// deeply, across strings/arrays/objects. Safe for other string fields.
export function stripInternalOrigin(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/^https?:\/\/[^/]+(\/wp-)/, "$1");
  }
  if (Array.isArray(value)) return value.map(stripInternalOrigin);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = stripInternalOrigin(v);
    return out;
  }
  return value;
}
