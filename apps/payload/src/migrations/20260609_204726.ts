import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_officers_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version__order\` text,
  	\`version_role\` text NOT NULL,
  	\`version_occupant_id\` text(36),
  	\`version_description\` text,
  	\`version_sanity_doc_id\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`officers\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_occupant_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_officers_v_parent_idx\` ON \`_officers_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_officers_v_version_version__order_idx\` ON \`_officers_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX \`_officers_v_version_version_occupant_idx\` ON \`_officers_v\` (\`version_occupant_id\`);`)
  await db.run(sql`CREATE INDEX \`_officers_v_version_version_sanity_doc_id_idx\` ON \`_officers_v\` (\`version_sanity_doc_id\`);`)
  await db.run(sql`CREATE INDEX \`_officers_v_version_version_updated_at_idx\` ON \`_officers_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_officers_v_version_version_created_at_idx\` ON \`_officers_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_officers_v_created_at_idx\` ON \`_officers_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_officers_v_updated_at_idx\` ON \`_officers_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`committees\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`sanity_doc_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`committees_sanity_doc_id_idx\` ON \`committees\` (\`sanity_doc_id\`);`)
  await db.run(sql`CREATE INDEX \`committees_updated_at_idx\` ON \`committees\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`committees_created_at_idx\` ON \`committees\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`committees_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`officers_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`committees\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`officers_id\`) REFERENCES \`officers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`committees_rels_order_idx\` ON \`committees_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`committees_rels_parent_idx\` ON \`committees_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`committees_rels_path_idx\` ON \`committees_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`committees_rels_officers_id_idx\` ON \`committees_rels\` (\`officers_id\`);`)
  await db.run(sql`CREATE TABLE \`_committees_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text NOT NULL,
  	\`version_description\` text,
  	\`version_sanity_doc_id\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`committees\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_committees_v_parent_idx\` ON \`_committees_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_committees_v_version_version_sanity_doc_id_idx\` ON \`_committees_v\` (\`version_sanity_doc_id\`);`)
  await db.run(sql`CREATE INDEX \`_committees_v_version_version_updated_at_idx\` ON \`_committees_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_committees_v_version_version_created_at_idx\` ON \`_committees_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_committees_v_created_at_idx\` ON \`_committees_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_committees_v_updated_at_idx\` ON \`_committees_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_committees_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`officers_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_committees_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`officers_id\`) REFERENCES \`officers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_committees_v_rels_order_idx\` ON \`_committees_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_committees_v_rels_parent_idx\` ON \`_committees_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_committees_v_rels_path_idx\` ON \`_committees_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_committees_v_rels_officers_id_idx\` ON \`_committees_v_rels\` (\`officers_id\`);`)
  await db.run(sql`ALTER TABLE \`officers\` ADD \`sanity_doc_id\` text;`)
  await db.run(sql`CREATE INDEX \`officers_sanity_doc_id_idx\` ON \`officers\` (\`sanity_doc_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`committees_id\` text(36) REFERENCES committees(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_committees_id_idx\` ON \`payload_locked_documents_rels\` (\`committees_id\`);`)
  await db.run(sql`ALTER TABLE \`people\` ADD \`bio\` text;`)
  await db.run(sql`ALTER TABLE \`people\` ADD \`sanity_doc_id\` text;`)
  await db.run(sql`CREATE INDEX \`people_sanity_doc_id_idx\` ON \`people\` (\`sanity_doc_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_officers_v\`;`)
  await db.run(sql`DROP TABLE \`committees\`;`)
  await db.run(sql`DROP TABLE \`committees_rels\`;`)
  await db.run(sql`DROP TABLE \`_committees_v\`;`)
  await db.run(sql`DROP TABLE \`_committees_v_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`governance_documents_id\` text(36),
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`media_id\` text(36),
  	\`officers_id\` text(36),
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`people_id\` text(36),
  	\`regatta_documents_id\` text(36),
  	\`regattas_id\` text(36),
  	\`safety_notices_id\` text(36),
  	\`trustees_id\` text(36),
  	\`users_id\` text(36),
  	\`vice_presidents_id\` text(36),
  	FOREIGN KEY (\`governance_documents_id\`) REFERENCES \`governance_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`officers_id\`) REFERENCES \`officers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`regatta_documents_id\`) REFERENCES \`regatta_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`regattas_id\`) REFERENCES \`regattas\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`safety_notices_id\`) REFERENCES \`safety_notices\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`trustees_id\`) REFERENCES \`trustees\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vice_presidents_id\`) REFERENCES \`vice_presidents\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("governance_documents_id", "id", "media_id", "officers_id", "order", "parent_id", "path", "people_id", "regatta_documents_id", "regattas_id", "safety_notices_id", "trustees_id", "users_id", "vice_presidents_id") SELECT "governance_documents_id", "id", "media_id", "officers_id", "order", "parent_id", "path", "people_id", "regatta_documents_id", "regattas_id", "safety_notices_id", "trustees_id", "users_id", "vice_presidents_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_governance_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`governance_documents_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_officers_id_idx\` ON \`payload_locked_documents_rels\` (\`officers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_people_id_idx\` ON \`payload_locked_documents_rels\` (\`people_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_regatta_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`regatta_documents_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_regattas_id_idx\` ON \`payload_locked_documents_rels\` (\`regattas_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_safety_notices_id_idx\` ON \`payload_locked_documents_rels\` (\`safety_notices_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_trustees_id_idx\` ON \`payload_locked_documents_rels\` (\`trustees_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_vice_presidents_id_idx\` ON \`payload_locked_documents_rels\` (\`vice_presidents_id\`);`)
  await db.run(sql`DROP INDEX \`people_sanity_doc_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`people\` DROP COLUMN \`bio\`;`)
  await db.run(sql`ALTER TABLE \`people\` DROP COLUMN \`sanity_doc_id\`;`)
  await db.run(sql`DROP INDEX \`officers_sanity_doc_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`officers\` DROP COLUMN \`sanity_doc_id\`;`)
}
