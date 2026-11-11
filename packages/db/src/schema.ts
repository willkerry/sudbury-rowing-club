import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Contact-form messages awaiting a delivery webhook from Resend. */
export const inflightContacts = sqliteTable(
  "inflight_contacts",
  {
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    messageId: text("message_id").primaryKey(),
    payload: text("payload", { mode: "json" }).$type<unknown>().notNull(),
  },
  (table) => [index("inflight_contacts_expires_at").on(table.expiresAt)],
);
