import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`member_notices_meta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`member_notices\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`member_notices_meta_order_idx\` ON \`member_notices_meta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`member_notices_meta_parent_id_idx\` ON \`member_notices_meta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`member_notices_documents_files\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`file_id\` text(36),
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`member_notices_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`member_notices_documents_files_order_idx\` ON \`member_notices_documents_files\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`member_notices_documents_files_parent_id_idx\` ON \`member_notices_documents_files\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`member_notices_documents_files_file_idx\` ON \`member_notices_documents_files\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`member_notices_documents\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`member_notices\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`member_notices_documents_order_idx\` ON \`member_notices_documents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`member_notices_documents_parent_id_idx\` ON \`member_notices_documents\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`member_notices\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`body\` text,
  	\`sanity_doc_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`member_notices_slug_idx\` ON \`member_notices\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`member_notices_sanity_doc_id_idx\` ON \`member_notices\` (\`sanity_doc_id\`);`)
  await db.run(sql`CREATE INDEX \`member_notices_updated_at_idx\` ON \`member_notices\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`member_notices_created_at_idx\` ON \`member_notices\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`member_notices__status_idx\` ON \`member_notices\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_member_notices_v_version_meta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_member_notices_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_meta_order_idx\` ON \`_member_notices_v_version_meta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_meta_parent_id_idx\` ON \`_member_notices_v_version_meta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_member_notices_v_version_documents_files\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`file_id\` text(36),
  	\`_uuid\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_member_notices_v_version_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_documents_files_order_idx\` ON \`_member_notices_v_version_documents_files\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_documents_files_parent_id_idx\` ON \`_member_notices_v_version_documents_files\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_documents_files_file_idx\` ON \`_member_notices_v_version_documents_files\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_member_notices_v_version_documents\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_member_notices_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_documents_order_idx\` ON \`_member_notices_v_version_documents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_documents_parent_id_idx\` ON \`_member_notices_v_version_documents\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_member_notices_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_body\` text,
  	\`version_sanity_doc_id\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`member_notices\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_member_notices_v_parent_idx\` ON \`_member_notices_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_version_slug_idx\` ON \`_member_notices_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_version_sanity_doc_id_idx\` ON \`_member_notices_v\` (\`version_sanity_doc_id\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_version_updated_at_idx\` ON \`_member_notices_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_version_created_at_idx\` ON \`_member_notices_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_version_version__status_idx\` ON \`_member_notices_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_created_at_idx\` ON \`_member_notices_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_updated_at_idx\` ON \`_member_notices_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_member_notices_v_latest_idx\` ON \`_member_notices_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`site_notice\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`display\` integer DEFAULT false,
  	\`variant\` text DEFAULT 'primary',
  	\`label\` text,
  	\`body\` text,
  	\`link\` text,
  	\`date\` text,
  	\`include_time\` integer DEFAULT false,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`_site_notice_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`version_display\` integer DEFAULT false,
  	\`version_variant\` text DEFAULT 'primary',
  	\`version_label\` text,
  	\`version_body\` text,
  	\`version_link\` text,
  	\`version_date\` text,
  	\`version_include_time\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_notice_v_created_at_idx\` ON \`_site_notice_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_notice_v_updated_at_idx\` ON \`_site_notice_v\` (\`updated_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`member_notices_id\` text(36) REFERENCES member_notices(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_member_notices_id_idx\` ON \`payload_locked_documents_rels\` (\`member_notices_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`member_notices_meta\`;`)
  await db.run(sql`DROP TABLE \`member_notices_documents_files\`;`)
  await db.run(sql`DROP TABLE \`member_notices_documents\`;`)
  await db.run(sql`DROP TABLE \`member_notices\`;`)
  await db.run(sql`DROP TABLE \`_member_notices_v_version_meta\`;`)
  await db.run(sql`DROP TABLE \`_member_notices_v_version_documents_files\`;`)
  await db.run(sql`DROP TABLE \`_member_notices_v_version_documents\`;`)
  await db.run(sql`DROP TABLE \`_member_notices_v\`;`)
  await db.run(sql`DROP TABLE \`site_notice\`;`)
  await db.run(sql`DROP TABLE \`_site_notice_v\`;`)
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
  	\`safety_notices_id\` text(36),
  	\`news_id\` text(36),
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
  	FOREIGN KEY (\`safety_notices_id\`) REFERENCES \`safety_notices\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "people_id", "officers_id", "committees_id", "regatta_documents_id", "regattas_id", "vice_presidents_id", "trustees_id", "governance_documents_id", "safety_notices_id", "news_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "people_id", "officers_id", "committees_id", "regatta_documents_id", "regattas_id", "vice_presidents_id", "trustees_id", "governance_documents_id", "safety_notices_id", "news_id" FROM \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_safety_notices_id_idx\` ON \`payload_locked_documents_rels\` (\`safety_notices_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`)
}
