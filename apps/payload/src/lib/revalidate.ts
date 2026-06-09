import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  GlobalAfterChangeHook,
  GlobalConfig,
} from "payload";

interface RevalidateBody {
  collection?: string;
  global?: string;
  id?: string | null;
  slug?: string | null;
}

/**
 * Fire-and-forget POST to the web app's /api/revalidate endpoint. Logs
 * and swallows network errors — a save in the admin should never fail
 * because the web side is briefly unreachable.
 */
async function notify(body: RevalidateBody): Promise<void> {
  const url = process.env.REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!(url && secret)) return;

  try {
    const response = await fetch(
      `${url}?secret=${encodeURIComponent(secret)}`,
      {
        body: JSON.stringify(body),
        headers: { "content-type": "application/json" },
        method: "POST",
      },
    );
    if (!response.ok) {
      console.warn(
        `[revalidate] ${response.status} from ${url} for ${JSON.stringify(body)}`,
      );
    }
  } catch (err) {
    console.warn(
      `[revalidate] fetch failed for ${JSON.stringify(body)}: ${(err as Error).message}`,
    );
  }
}

function slugOf(doc: unknown): string | null {
  if (!doc || typeof doc !== "object") return null;
  const value = (doc as { slug?: unknown }).slug;
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const current = (value as { current?: unknown }).current;
    if (typeof current === "string") return current;
  }

  return null;
}

function idOf(doc: unknown): string | null {
  if (!doc || typeof doc !== "object") return null;
  const id = (doc as { id?: unknown }).id;

  return typeof id === "string" ? id : null;
}

/**
 * Build a pair of after-change and after-delete hooks for a Payload
 * collection that POSTs to the web app's revalidation endpoint. Wire
 * via:
 *
 *   const revalidate = collectionHooks("news");
 *   hooks: {
 *     afterChange: [revalidate.afterChange],
 *     afterDelete: [revalidate.afterDelete],
 *   }
 */
export function collectionHooks(collection: string): {
  afterChange: CollectionAfterChangeHook;
  afterDelete: CollectionAfterDeleteHook;
} {
  const afterChange: CollectionAfterChangeHook = async ({ doc }) => {
    await notify({ collection, id: idOf(doc), slug: slugOf(doc) });

    return doc;
  };

  const afterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
    await notify({ collection, id: idOf(doc), slug: slugOf(doc) });
  };

  return { afterChange, afterDelete };
}

/**
 * Build an after-change hook for a Payload global.
 */
export function globalHook(global: string): GlobalAfterChangeHook {
  return async ({ doc }) => {
    await notify({ global });

    return doc;
  };
}

/**
 * Wrap a collection config so its writes notify the web app.
 * Preserves any hooks the collection already had.
 */
export function withRevalidation(config: CollectionConfig): CollectionConfig {
  const hooks = collectionHooks(config.slug);

  return {
    ...config,
    hooks: {
      ...config.hooks,
      afterChange: [...(config.hooks?.afterChange ?? []), hooks.afterChange],
      afterDelete: [...(config.hooks?.afterDelete ?? []), hooks.afterDelete],
    },
  };
}

/**
 * Wrap a global config so its writes notify the web app.
 */
export function withGlobalRevalidation(config: GlobalConfig): GlobalConfig {
  const hook = globalHook(config.slug);

  return {
    ...config,
    hooks: {
      ...config.hooks,
      afterChange: [...(config.hooks?.afterChange ?? []), hook],
    },
  };
}
