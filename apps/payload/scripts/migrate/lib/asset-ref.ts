/**
 * Extract a Sanity asset id from any of the shapes that can appear in a
 * dataset export:
 *
 *   { asset: { _ref: "image-<sha>-<dims>-<ext>" } }   // legacy in-ndjson
 *   { _sanityAsset: "image@file://./images/<sha>-<dims>.<ext>" }   // newer
 *   { image: { ...one of the above... } }   // figure-wrapper variants
 *
 * Returns the bare Sanity asset id ("image-<sha>" / "file-<sha>") that
 * keys into `assets.json`, or undefined if nothing recognisable was found.
 */
export function assetIdFrom(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return;
  const obj = value as Record<string, unknown>;

  const direct = extract(obj);
  if (direct) return direct;

  const inner = obj.image;
  if (inner && typeof inner === "object") {
    const fromInner = extract(inner as Record<string, unknown>);
    if (fromInner) return fromInner;
  }

  return;
}

const SANITY_ASSET_RE = /^(image|file)@file:\/\/.*?\/([a-f0-9]+)(?:-|\.)/;

function extract(obj: Record<string, unknown>): string | undefined {
  const ref = (obj.asset as { _ref?: string } | undefined)?._ref;
  if (ref) return ref;

  const sanityAsset = obj._sanityAsset;
  if (typeof sanityAsset === "string") {
    const match = sanityAsset.match(SANITY_ASSET_RE);
    if (match) return `${match[1]}-${match[2]}`;
  }

  return;
}
