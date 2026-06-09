import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`governance_groups\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`title\` text NOT NULL,
  	\`sanity_doc_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`governance_groups__order_idx\` ON \`governance_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`governance_groups_sanity_doc_id_idx\` ON \`governance_groups\` (\`sanity_doc_id\`);`)
  await db.run(sql`CREATE INDEX \`governance_groups_updated_at_idx\` ON \`governance_groups\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`governance_groups_created_at_idx\` ON \`governance_groups\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`_governance_groups_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version__order\` text,
  	\`version_title\` text NOT NULL,
  	\`version_sanity_doc_id\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`governance_groups\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_governance_groups_v_parent_idx\` ON \`_governance_groups_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_governance_groups_v_version_version__order_idx\` ON \`_governance_groups_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX \`_governance_groups_v_version_version_sanity_doc_id_idx\` ON \`_governance_groups_v\` (\`version_sanity_doc_id\`);`)
  await db.run(sql`CREATE INDEX \`_governance_groups_v_version_version_updated_at_idx\` ON \`_governance_groups_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_governance_groups_v_version_version_created_at_idx\` ON \`_governance_groups_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_governance_groups_v_created_at_idx\` ON \`_governance_groups_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_governance_groups_v_updated_at_idx\` ON \`_governance_groups_v\` (\`updated_at\`);`)
  await db.run(sql`DROP TABLE \`governance_documents_type\`;`)
  await db.run(sql`DROP TABLE \`_governance_documents_v_version_type\`;`)
  await db.run(sql`DROP TABLE \`governance\`;`)
  await db.run(sql`DROP TABLE \`governance_rels\`;`)
  await db.run(sql`ALTER TABLE \`governance_documents\` ADD \`type\` text DEFAULT 'file' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`governance_documents\` ADD \`group_id\` text(36) REFERENCES governance_groups(id);`)
  await db.run(sql`ALTER TABLE \`governance_documents\` ADD \`sanity_doc_id\` text;`)
  await db.run(sql`CREATE INDEX \`governance_documents_group_idx\` ON \`governance_documents\` (\`group_id\`);`)
  await db.run(sql`CREATE INDEX \`governance_documents_sanity_doc_id_idx\` ON \`governance_documents\` (\`sanity_doc_id\`);`)
  await db.run(sql`ALTER TABLE \`_governance_documents_v\` ADD \`version_type\` text DEFAULT 'file' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`_governance_documents_v\` ADD \`version_group_id\` text(36) REFERENCES governance_groups(id);`)
  await db.run(sql`ALTER TABLE \`_governance_documents_v\` ADD \`version_sanity_doc_id\` text;`)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_version_version_group_idx\` ON \`_governance_documents_v\` (\`version_group_id\`);`)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_version_version_sanity_doc_id_idx\` ON \`_governance_documents_v\` (\`version_sanity_doc_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`governance_groups_id\` text(36) REFERENCES governance_groups(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_governance_groups_id_idx\` ON \`payload_locked_documents_rels\` (\`governance_groups_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`governance_documents_type\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text(36) NOT NULL,
  	\`value\` text,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`governance_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`governance_documents_type_order_idx\` ON \`governance_documents_type\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`governance_documents_type_parent_idx\` ON \`governance_documents_type\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_governance_documents_v_version_type\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text(36) NOT NULL,
  	\`value\` text,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_governance_documents_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_version_type_order_idx\` ON \`_governance_documents_v_version_type\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_version_type_parent_idx\` ON \`_governance_documents_v_version_type\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`governance\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`governance_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`people_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`governance\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`governance_rels_order_idx\` ON \`governance_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`governance_rels_parent_idx\` ON \`governance_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`governance_rels_path_idx\` ON \`governance_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`governance_rels_people_id_idx\` ON \`governance_rels\` (\`people_id\`);`)
  await db.run(sql`DROP TABLE \`governance_groups\`;`)
  await db.run(sql`DROP TABLE \`_governance_groups_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_governance_documents\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`title\` text NOT NULL,
  	\`enabled\` integer DEFAULT true,
  	\`file_id\` text(36),
  	\`url\` text,
  	\`rich_text\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_governance_documents\`("id", "_order", "title", "enabled", "file_id", "url", "rich_text", "updated_at", "created_at") SELECT "id", "_order", "title", "enabled", "file_id", "url", "rich_text", "updated_at", "created_at" FROM \`governance_documents\`;`)
  await db.run(sql`DROP TABLE \`governance_documents\`;`)
  await db.run(sql`ALTER TABLE \`__new_governance_documents\` RENAME TO \`governance_documents\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`governance_documents__order_idx\` ON \`governance_documents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`governance_documents_file_idx\` ON \`governance_documents\` (\`file_id\`);`)
  await db.run(sql`CREATE INDEX \`governance_documents_updated_at_idx\` ON \`governance_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`governance_documents_created_at_idx\` ON \`governance_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new__governance_documents_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version__order\` text,
  	\`version_title\` text NOT NULL,
  	\`version_enabled\` integer DEFAULT true,
  	\`version_file_id\` text(36),
  	\`version_url\` text,
  	\`version_rich_text\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`governance_documents\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__governance_documents_v\`("id", "parent_id", "version__order", "version_title", "version_enabled", "version_file_id", "version_url", "version_rich_text", "version_updated_at", "version_created_at", "created_at", "updated_at") SELECT "id", "parent_id", "version__order", "version_title", "version_enabled", "version_file_id", "version_url", "version_rich_text", "version_updated_at", "version_created_at", "created_at", "updated_at" FROM \`_governance_documents_v\`;`)
  await db.run(sql`DROP TABLE \`_governance_documents_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__governance_documents_v\` RENAME TO \`_governance_documents_v\`;`)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_parent_idx\` ON \`_governance_documents_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_version_version__order_idx\` ON \`_governance_documents_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_version_version_file_idx\` ON \`_governance_documents_v\` (\`version_file_id\`);`)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_version_version_updated_at_idx\` ON \`_governance_documents_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_version_version_created_at_idx\` ON \`_governance_documents_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_created_at_idx\` ON \`_governance_documents_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_governance_documents_v_updated_at_idx\` ON \`_governance_documents_v\` (\`updated_at\`);`)
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
  	FOREIGN KEY (\`safety_notices_id\`) REFERENCES \`safety_notices\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`member_notices_id\`) REFERENCES \`member_notices\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "people_id", "officers_id", "committees_id", "regatta_documents_id", "regattas_id", "vice_presidents_id", "trustees_id", "governance_documents_id", "safety_notices_id", "news_id", "member_notices_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "people_id", "officers_id", "committees_id", "regatta_documents_id", "regattas_id", "vice_presidents_id", "trustees_id", "governance_documents_id", "safety_notices_id", "news_id", "member_notices_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
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
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_member_notices_id_idx\` ON \`payload_locked_documents_rels\` (\`member_notices_id\`);`)
}
