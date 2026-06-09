import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-d1-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // `bio` was already added by a dev-mode push to the local DB. Use ALTER
  // TABLE IF NOT EXISTS semantics by attempting and tolerating duplicates.
  try {
    await db.run(sql`ALTER TABLE \`people\` ADD \`bio\` text;`);
  } catch (err) {
    if (!String((err as Error).message).includes("duplicate column name")) {
      throw err;
    }
  }

  try {
    await db.run(sql`ALTER TABLE \`people\` ADD \`sanity_doc_id\` text;`);
  } catch (err) {
    if (!String((err as Error).message).includes("duplicate column name")) {
      throw err;
    }
  }

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`people_sanity_doc_id_idx\` ON \`people\` (\`sanity_doc_id\`);`,
  );
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`people_sanity_doc_id_idx\`;`);
  await db.run(sql`ALTER TABLE \`people\` DROP COLUMN \`sanity_doc_id\`;`);
  await db.run(sql`ALTER TABLE \`people\` DROP COLUMN \`bio\`;`);
}
