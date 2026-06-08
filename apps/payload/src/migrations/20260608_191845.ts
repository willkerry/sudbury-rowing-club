import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-d1-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `);
  await db.run(
    sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`,
  );
  await db.run(
    sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`,
  );
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric
  );
  `);
  await db.run(
    sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`,
  );
  await db.run(
    sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`,
  );
  await db.run(sql`CREATE TABLE \`people\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`last_name\` text NOT NULL,
  	\`full_name\` text,
  	\`email\` text,
  	\`has_email\` integer DEFAULT false,
  	\`image_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`people_image_idx\` ON \`people\` (\`image_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`people_updated_at_idx\` ON \`people\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`people_created_at_idx\` ON \`people\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`officers\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`role\` text NOT NULL,
  	\`occupant_id\` text(36),
  	\`description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`occupant_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`officers__order_idx\` ON \`officers\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`officers_occupant_idx\` ON \`officers\` (\`occupant_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`officers_updated_at_idx\` ON \`officers\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`officers_created_at_idx\` ON \`officers\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`regatta_documents\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`title\` text NOT NULL,
  	\`enabled\` integer DEFAULT true,
  	\`file_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`regatta_documents__order_idx\` ON \`regatta_documents\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regatta_documents_file_idx\` ON \`regatta_documents\` (\`file_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regatta_documents_updated_at_idx\` ON \`regatta_documents\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regatta_documents_created_at_idx\` ON \`regatta_documents\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`_regatta_documents_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version__order\` text,
  	\`version_title\` text NOT NULL,
  	\`version_enabled\` integer DEFAULT true,
  	\`version_file_id\` text(36),
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`regatta_documents\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_regatta_documents_v_parent_idx\` ON \`_regatta_documents_v\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_regatta_documents_v_version_version__order_idx\` ON \`_regatta_documents_v\` (\`version__order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_regatta_documents_v_version_version_file_idx\` ON \`_regatta_documents_v\` (\`version_file_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_regatta_documents_v_version_version_updated_at_idx\` ON \`_regatta_documents_v\` (\`version_updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_regatta_documents_v_version_version_created_at_idx\` ON \`_regatta_documents_v\` (\`version_created_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_regatta_documents_v_created_at_idx\` ON \`_regatta_documents_v\` (\`created_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_regatta_documents_v_updated_at_idx\` ON \`_regatta_documents_v\` (\`updated_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`regattas_galleries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`url\` text NOT NULL,
  	\`password\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`regattas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`regattas_galleries_order_idx\` ON \`regattas_galleries\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regattas_galleries_parent_id_idx\` ON \`regattas_galleries\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`regattas\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`number\` numeric NOT NULL,
  	\`date\` text NOT NULL,
  	\`results\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE INDEX \`regattas_updated_at_idx\` ON \`regattas\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regattas_created_at_idx\` ON \`regattas\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`vice_presidents\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`person_id\` text(36) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`person_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`vice_presidents_person_idx\` ON \`vice_presidents\` (\`person_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`vice_presidents_updated_at_idx\` ON \`vice_presidents\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`vice_presidents_created_at_idx\` ON \`vice_presidents\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`trustees\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`person_id\` text(36) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`person_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`trustees_person_idx\` ON \`trustees\` (\`person_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`trustees_updated_at_idx\` ON \`trustees\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`trustees_created_at_idx\` ON \`trustees\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`governance_documents_type\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text(36) NOT NULL,
  	\`value\` text,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`governance_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`governance_documents_type_order_idx\` ON \`governance_documents_type\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`governance_documents_type_parent_idx\` ON \`governance_documents_type\` (\`parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`governance_documents\` (
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
  `);
  await db.run(
    sql`CREATE INDEX \`governance_documents__order_idx\` ON \`governance_documents\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`governance_documents_file_idx\` ON \`governance_documents\` (\`file_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`governance_documents_updated_at_idx\` ON \`governance_documents\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`governance_documents_created_at_idx\` ON \`governance_documents\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`_governance_documents_v_version_type\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text(36) NOT NULL,
  	\`value\` text,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_governance_documents_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_governance_documents_v_version_type_order_idx\` ON \`_governance_documents_v_version_type\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_governance_documents_v_version_type_parent_idx\` ON \`_governance_documents_v_version_type\` (\`parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_governance_documents_v\` (
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
  `);
  await db.run(
    sql`CREATE INDEX \`_governance_documents_v_parent_idx\` ON \`_governance_documents_v\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_governance_documents_v_version_version__order_idx\` ON \`_governance_documents_v\` (\`version__order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_governance_documents_v_version_version_file_idx\` ON \`_governance_documents_v\` (\`version_file_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_governance_documents_v_version_version_updated_at_idx\` ON \`_governance_documents_v\` (\`version_updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_governance_documents_v_version_version_created_at_idx\` ON \`_governance_documents_v\` (\`version_created_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_governance_documents_v_created_at_idx\` ON \`_governance_documents_v\` (\`created_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_governance_documents_v_updated_at_idx\` ON \`_governance_documents_v\` (\`updated_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`safety_notices\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`body\` text,
  	\`pin\` integer,
  	\`document_title\` text,
  	\`document_document_id\` text(36),
  	\`link\` text,
  	\`date\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`document_document_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`safety_notices_document_document_document_idx\` ON \`safety_notices\` (\`document_document_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`safety_notices_updated_at_idx\` ON \`safety_notices\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`safety_notices_created_at_idx\` ON \`safety_notices\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` text(36),
  	\`media_id\` text(36),
  	\`people_id\` text(36),
  	\`officers_id\` text(36),
  	\`regatta_documents_id\` text(36),
  	\`regattas_id\` text(36),
  	\`vice_presidents_id\` text(36),
  	\`trustees_id\` text(36),
  	\`governance_documents_id\` text(36),
  	\`safety_notices_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`officers_id\`) REFERENCES \`officers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`regatta_documents_id\`) REFERENCES \`regatta_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`regattas_id\`) REFERENCES \`regattas\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vice_presidents_id\`) REFERENCES \`vice_presidents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`trustees_id\`) REFERENCES \`trustees\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`governance_documents_id\`) REFERENCES \`governance_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`safety_notices_id\`) REFERENCES \`safety_notices\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_people_id_idx\` ON \`payload_locked_documents_rels\` (\`people_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_officers_id_idx\` ON \`payload_locked_documents_rels\` (\`officers_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_regatta_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`regatta_documents_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_regattas_id_idx\` ON \`payload_locked_documents_rels\` (\`regattas_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_vice_presidents_id_idx\` ON \`payload_locked_documents_rels\` (\`vice_presidents_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_trustees_id_idx\` ON \`payload_locked_documents_rels\` (\`trustees_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_governance_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`governance_documents_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_safety_notices_id_idx\` ON \`payload_locked_documents_rels\` (\`safety_notices_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`landing_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`landing\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`landing_images_order_idx\` ON \`landing_images\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`landing_images_parent_id_idx\` ON \`landing_images\` (\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`landing_images_image_idx\` ON \`landing_images\` (\`image_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`landing\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`tagline\` text,
  	\`description\` text,
  	\`hero_id\` text(36),
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`landing_hero_idx\` ON \`landing\` (\`hero_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`regatta_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`regatta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`regatta_images_order_idx\` ON \`regatta_images\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regatta_images_parent_id_idx\` ON \`regatta_images\` (\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regatta_images_image_idx\` ON \`regatta_images\` (\`image_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`regatta_events_boat_classes\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`regatta_events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`regatta_events_boat_classes_order_idx\` ON \`regatta_events_boat_classes\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regatta_events_boat_classes_parent_idx\` ON \`regatta_events_boat_classes\` (\`parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`regatta_events\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`gender\` text,
  	\`prizes\` text,
  	\`course\` text,
  	\`categories\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`regatta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`regatta_events_order_idx\` ON \`regatta_events\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regatta_events_parent_id_idx\` ON \`regatta_events\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`regatta\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`date\` text,
  	\`tagline\` text,
  	\`description\` text,
  	\`entries_description\` text,
  	\`results_description\` text,
  	\`results_course_records_id\` text(36),
  	\`course_heading\` text,
  	\`course_description\` text,
  	\`course_map_id\` text(36),
  	\`course_map_image_id\` text(36),
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`results_course_records_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`course_map_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`course_map_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`regatta_results_results_course_records_idx\` ON \`regatta\` (\`results_course_records_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regatta_course_course_map_idx\` ON \`regatta\` (\`course_map_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`regatta_course_course_map_image_idx\` ON \`regatta\` (\`course_map_image_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`governance\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `);
  await db.run(sql`CREATE TABLE \`governance_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`people_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`governance\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`people_id\`) REFERENCES \`people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`governance_rels_order_idx\` ON \`governance_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`governance_rels_parent_idx\` ON \`governance_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`governance_rels_path_idx\` ON \`governance_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`governance_rels_people_id_idx\` ON \`governance_rels\` (\`people_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`safety_status\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`status\` text,
  	\`description\` text,
  	\`display\` integer,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`);
  await db.run(sql`DROP TABLE \`users\`;`);
  await db.run(sql`DROP TABLE \`media\`;`);
  await db.run(sql`DROP TABLE \`people\`;`);
  await db.run(sql`DROP TABLE \`officers\`;`);
  await db.run(sql`DROP TABLE \`regatta_documents\`;`);
  await db.run(sql`DROP TABLE \`_regatta_documents_v\`;`);
  await db.run(sql`DROP TABLE \`regattas_galleries\`;`);
  await db.run(sql`DROP TABLE \`regattas\`;`);
  await db.run(sql`DROP TABLE \`vice_presidents\`;`);
  await db.run(sql`DROP TABLE \`trustees\`;`);
  await db.run(sql`DROP TABLE \`governance_documents_type\`;`);
  await db.run(sql`DROP TABLE \`governance_documents\`;`);
  await db.run(sql`DROP TABLE \`_governance_documents_v_version_type\`;`);
  await db.run(sql`DROP TABLE \`_governance_documents_v\`;`);
  await db.run(sql`DROP TABLE \`safety_notices\`;`);
  await db.run(sql`DROP TABLE \`payload_kv\`;`);
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`);
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`);
  await db.run(sql`DROP TABLE \`payload_preferences\`;`);
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`);
  await db.run(sql`DROP TABLE \`payload_migrations\`;`);
  await db.run(sql`DROP TABLE \`landing_images\`;`);
  await db.run(sql`DROP TABLE \`landing\`;`);
  await db.run(sql`DROP TABLE \`regatta_images\`;`);
  await db.run(sql`DROP TABLE \`regatta_events_boat_classes\`;`);
  await db.run(sql`DROP TABLE \`regatta_events\`;`);
  await db.run(sql`DROP TABLE \`regatta\`;`);
  await db.run(sql`DROP TABLE \`governance\`;`);
  await db.run(sql`DROP TABLE \`governance_rels\`;`);
  await db.run(sql`DROP TABLE \`safety_status\`;`);
}
