import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`archive\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`year\` text,
  	\`range\` numeric DEFAULT 0,
  	\`description\` text,
  	\`image_id\` text(36),
  	\`alt\` text,
  	\`location_lat\` numeric,
  	\`location_lng\` numeric,
  	\`sanity_doc_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`archive_image_idx\` ON \`archive\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`archive_sanity_doc_id_idx\` ON \`archive\` (\`sanity_doc_id\`);`)
  await db.run(sql`CREATE INDEX \`archive_updated_at_idx\` ON \`archive\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`archive_created_at_idx\` ON \`archive\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`_archive_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text NOT NULL,
  	\`version_year\` text,
  	\`version_range\` numeric DEFAULT 0,
  	\`version_description\` text,
  	\`version_image_id\` text(36),
  	\`version_alt\` text,
  	\`version_location_lat\` numeric,
  	\`version_location_lng\` numeric,
  	\`version_sanity_doc_id\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`archive\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_archive_v_parent_idx\` ON \`_archive_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_archive_v_version_version_image_idx\` ON \`_archive_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_archive_v_version_version_sanity_doc_id_idx\` ON \`_archive_v\` (\`version_sanity_doc_id\`);`)
  await db.run(sql`CREATE INDEX \`_archive_v_version_version_updated_at_idx\` ON \`_archive_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_archive_v_version_version_created_at_idx\` ON \`_archive_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_archive_v_created_at_idx\` ON \`_archive_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_archive_v_updated_at_idx\` ON \`_archive_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`regattas_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`quote\` text NOT NULL,
  	\`name\` text,
  	\`club\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`regattas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`regattas_testimonials_order_idx\` ON \`regattas_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`regattas_testimonials_parent_id_idx\` ON \`regattas_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`regatta_documents\` ADD \`sanity_doc_id\` text;`)
  await db.run(sql`CREATE INDEX \`regatta_documents_sanity_doc_id_idx\` ON \`regatta_documents\` (\`sanity_doc_id\`);`)
  await db.run(sql`ALTER TABLE \`_regatta_documents_v\` ADD \`version_sanity_doc_id\` text;`)
  await db.run(sql`CREATE INDEX \`_regatta_documents_v_version_version_sanity_doc_id_idx\` ON \`_regatta_documents_v\` (\`version_sanity_doc_id\`);`)
  await db.run(sql`ALTER TABLE \`regattas\` ADD \`sanity_doc_id\` text;`)
  await db.run(sql`CREATE INDEX \`regattas_sanity_doc_id_idx\` ON \`regattas\` (\`sanity_doc_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`archive_id\` text(36) REFERENCES archive(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_archive_id_idx\` ON \`payload_locked_documents_rels\` (\`archive_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`archive\`;`)
  await db.run(sql`DROP TABLE \`_archive_v\`;`)
  await db.run(sql`DROP TABLE \`regattas_testimonials\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` text(36),
  	\`media_id\` text(36),
  	\`people_id\` text(36),
  	\`officers_id\` text(36),
  	\`committees_id\` text(36),
  	\`regatta_documents_id\` text(36),
  	\`regattas_id\` text(36),
  	\`vice_presidents_id\` text(36),
  	\`trustees_id\` text(36),
  	\`governance_documents_id\` text(36),
  	\`governance_groups_id\` text(36),
  	\`safety_notices_id\` text(36),
  	\`news_id\` text(36),
  	\`member_notices_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`officers_id\`) REFERENCES \`officers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`committees_id\`) REFERENCES \`committees\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`regatta_documents_id\`) REFERENCES \`regatta_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`regattas_id\`) REFERENCES \`regattas\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vice_presidents_id\`) REFERENCES \`vice_presidents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`trustees_id\`) REFERENCES \`trustees\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`governance_documents_id\`) REFERENCES \`governance_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`governance_groups_id\`) REFERENCES \`governance_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`safety_notices_id\`) REFERENCES \`safety_notices\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`member_notices_id\`) REFERENCES \`member_notices\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "people_id", "officers_id", "committees_id", "regatta_documents_id", "regattas_id", "vice_presidents_id", "trustees_id", "governance_documents_id", "governance_groups_id", "safety_notices_id", "news_id", "member_notices_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "people_id", "officers_id", "committees_id", "regatta_documents_id", "regattas_id", "vice_presidents_id", "trustees_id", "governance_documents_id", "governance_groups_id", "safety_notices_id", "news_id", "member_notices_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_people_id_idx\` ON \`payload_locked_documents_rels\` (\`people_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_officers_id_idx\` ON \`payload_locked_documents_rels\` (\`officers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_committees_id_idx\` ON \`payload_locked_documents_rels\` (\`committees_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_regatta_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`regatta_documents_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_regattas_id_idx\` ON \`payload_locked_documents_rels\` (\`regattas_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_vice_presidents_id_idx\` ON \`payload_locked_documents_rels\` (\`vice_presidents_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_trustees_id_idx\` ON \`payload_locked_documents_rels\` (\`trustees_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_governance_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`governance_documents_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_governance_groups_id_idx\` ON \`payload_locked_documents_rels\` (\`governance_groups_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_safety_notices_id_idx\` ON \`payload_locked_documents_rels\` (\`safety_notices_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_member_notices_id_idx\` ON \`payload_locked_documents_rels\` (\`member_notices_id\`);`)
  await db.run(sql`DROP INDEX \`regatta_documents_sanity_doc_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`regatta_documents\` DROP COLUMN \`sanity_doc_id\`;`)
  await db.run(sql`DROP INDEX \`_regatta_documents_v_version_version_sanity_doc_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`_regatta_documents_v\` DROP COLUMN \`version_sanity_doc_id\`;`)
  await db.run(sql`DROP INDEX \`regattas_sanity_doc_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`regattas\` DROP COLUMN \`sanity_doc_id\`;`)
}
