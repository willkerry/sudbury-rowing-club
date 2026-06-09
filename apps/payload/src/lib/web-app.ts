/**
 * Build a URL on the consumer website (apps/web). Reads `WEB_APP_URL`
 * from the environment; falls back to localhost:4321 (the local dev port
 * per CLAUDE.md). Trailing slashes on the env value are tolerated.
 */
const TRAILING_SLASHES = /\/+$/;

export function webAppUrl(path: string): string {
  const base = (process.env.WEB_APP_URL ?? "http://localhost:4321").replace(
    TRAILING_SLASHES,
    "",
  );
  const cleaned = path.startsWith("/") ? path : `/${path}`;

  return `${base}${cleaned}`;
}
