import { env } from "cloudflare:workers";
import { createDb, inflightContacts } from "@sudburyrc/db";
import { and, eq, gt, lte } from "drizzle-orm";

// D1 rather than KV: the Resend webhook reads an entry seconds after it is
// written, possibly in another location, and claims it exactly once.
const getDb = () => createDb(env.DB);

export const inflightStore = {
  /** Atomically deletes an entry, returning how many rows were removed. */
  del: async (messageId: string): Promise<number> => {
    const deleted = await getDb()
      .delete(inflightContacts)
      .where(eq(inflightContacts.messageId, messageId))
      .returning({ messageId: inflightContacts.messageId });

    return deleted.length;
  },

  get: async (messageId: string): Promise<unknown> => {
    const row = await getDb()
      .select({ payload: inflightContacts.payload })
      .from(inflightContacts)
      .where(
        and(
          eq(inflightContacts.messageId, messageId),
          gt(inflightContacts.expiresAt, new Date()),
        ),
      )
      .get();

    return row?.payload ?? null;
  },

  set: async (
    messageId: string,
    payload: unknown,
    { ttlSeconds }: { ttlSeconds: number },
  ): Promise<void> => {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    await getDb()
      .insert(inflightContacts)
      .values({ expiresAt, messageId, payload })
      .onConflictDoUpdate({
        set: { expiresAt, payload },
        target: inflightContacts.messageId,
      });
  },
};

/**
 * Deletes expired entries, which hold contact details. Runs from the hourly
 * cron trigger in worker.ts, since D1 has no TTL of its own.
 */
export const pruneExpiredInflightContacts = async (): Promise<number> => {
  const deleted = await getDb()
    .delete(inflightContacts)
    .where(lte(inflightContacts.expiresAt, new Date()))
    .returning({ messageId: inflightContacts.messageId });

  return deleted.length;
};
