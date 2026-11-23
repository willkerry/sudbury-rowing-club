// Common placeholder values that should be rejected
const INVALID_URL_PATTERNS = [
  /^(tbc|tba|n\/a|na|none|null|undefined|xxx|pending|unknown)$/i,
  /^\.+$/, // Just dots
  /^-+$/, // Just dashes
];

const PROTOCOL_REGEX = /^https?:\/\//i;
const DOMAIN_PATTERN =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+/i;

/**
 * Normalise a URL by adding the https:// protocol if missing
 * Only accepts URLs that look like valid domains
 *
 * @param url - The potentially partial URL
 * @returns Normalised URL or null if invalid
 *
 * @example
 * ```ts
 * normaliseUrl('example.com') // 'https://example.com'
 * normaliseUrl('https://example.com') // 'https://example.com'
 * normaliseUrl('peterboroughcityrowingclub.org.uk') // 'https://peterboroughcityrowingclub.org.uk'
 * normaliseUrl('xxx') // null
 * normaliseUrl('TBC') // null
 * ```
 */
export function normaliseUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();

  // Reject empty strings or obvious placeholders
  if (
    !trimmed ||
    INVALID_URL_PATTERNS.some((pattern) => pattern.test(trimmed))
  ) {
    return null;
  }

  // If it already has a protocol, validate and return
  if (PROTOCOL_REGEX.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const urlString = parsed.toString();

      return urlString.endsWith("/") && parsed.pathname === "/"
        ? urlString.slice(0, -1)
        : urlString;
    } catch {
      return null;
    }
  }

  // Check if it looks like a domain (has a dot and valid characters)
  // Must have at least one dot and look domain-like
  if (!DOMAIN_PATTERN.test(trimmed)) {
    return null;
  }

  // Try adding https:// and validate
  try {
    const normalized = `https://${trimmed}`;
    const parsed = new URL(normalized);

    // Ensure it has a proper hostname with TLD
    if (!parsed.hostname?.includes(".")) {
      return null;
    }

    // Reject single-letter TLDs (likely typos) except common ones
    const parts = parsed.hostname.split(".");
    const tld = parts.at(-1);
    if (tld && tld.length === 1 && !["x", "a"].includes(tld.toLowerCase())) {
      return null;
    }

    return normalized;
  } catch {
    return null;
  }
}
