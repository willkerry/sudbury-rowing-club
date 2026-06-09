import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`archive\` DROP COLUMN \`description\`;`)
  await db.run(sql`ALTER TABLE \`archive\` DROP COLUMN \`alt\`;`)
  await db.run(sql`ALTER TABLE \`_archive_v\` DROP COLUMN \`version_description\`;`)
  await db.run(sql`ALTER TABLE \`_archive_v\` DROP COLUMN \`version_alt\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`archive\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`archive\` ADD \`alt\` text;`)
  await db.run(sql`ALTER TABLE \`_archive_v\` ADD \`version_description\` text;`)
  await db.run(sql`ALTER TABLE \`_archive_v\` ADD \`version_alt\` text;`)
}
