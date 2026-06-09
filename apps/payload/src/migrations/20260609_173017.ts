import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-d1-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`media\` ADD \`sanity_asset_id\` text;`);
  await db.run(
    sql`CREATE INDEX \`media_sanity_asset_id_idx\` ON \`media\` (\`sanity_asset_id\`);`,
  );
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`media_sanity_asset_id_idx\`;`);
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sanity_asset_id\`;`);
}
