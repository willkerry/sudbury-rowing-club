import { assetIdFrom } from "./asset-ref";
import type { SanityExportReader } from "./sanity-export";

/**
 * Walk every document in the Sanity export looking for `figure` blocks
 * (anywhere — top-level body, nested inside note/quote bodies, gallery
 * arrays, etc.) and collect the per-asset caption to migrate onto the
 * Media record.
 *
 * Multiple usages of the same asset can carry different captions. The
 * spec says "naively use whichever is longer"; that's the rule applied
 * here. Returns a `Map<sanityAssetId, caption>`.
 */
export async function collectCaptions(
  reader: SanityExportReader,
): Promise<Map<string, string>> {
  const best = new Map<string, string>();

  function consider(figure: Record<string, unknown>): void {
    const caption =
      typeof figure.caption === "string" ? figure.caption.trim() : "";
    if (!caption) return;
    const assetId = assetIdFrom(figure);
    if (!assetId) return;
    const current = best.get(assetId);
    if (!current || caption.length > current.length) {
      best.set(assetId, caption);
    }
  }

  function visit(node: unknown): void {
    if (Array.isArray(node)) {
      for (const item of node) visit(item);

      return;
    }
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;
    if (obj._type === "figure") consider(obj);
    for (const value of Object.values(obj)) visit(value);
  }

  for await (const doc of reader.allDocs()) {
    visit(doc);
  }

  return best;
}
