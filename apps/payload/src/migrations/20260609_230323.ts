import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`handle\` text,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_socials_order_idx\` ON \`site_settings_socials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_socials_parent_id_idx\` ON \`site_settings_socials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`club_name\` text DEFAULT 'Sudbury Rowing Club',
  	\`club_email\` text,
  	\`club_logo_id\` text(36),
  	\`club_founding_date\` text,
  	\`address_street_address\` text,
  	\`address_locality\` text DEFAULT 'Sudbury',
  	\`address_region\` text DEFAULT 'Suffolk',
  	\`address_postal_code\` text,
  	\`address_country\` text DEFAULT 'United Kingdom',
  	\`address_map_url\` text,
  	\`location_lat\` numeric,
  	\`location_lng\` numeric,
  	\`regatta_location_lat\` numeric,
  	\`regatta_location_lng\` numeric,
  	\`sender_name\` text DEFAULT 'Sudbury Rowing Club',
  	\`sender_email\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`club_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_club_club_logo_idx\` ON \`site_settings\` (\`club_logo_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`handle\` text,
  	\`href\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_socials_order_idx\` ON \`_site_settings_v_version_socials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_socials_parent_id_idx\` ON \`_site_settings_v_version_socials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`version_club_name\` text DEFAULT 'Sudbury Rowing Club',
  	\`version_club_email\` text,
  	\`version_club_logo_id\` text(36),
  	\`version_club_founding_date\` text,
  	\`version_address_street_address\` text,
  	\`version_address_locality\` text DEFAULT 'Sudbury',
  	\`version_address_region\` text DEFAULT 'Suffolk',
  	\`version_address_postal_code\` text,
  	\`version_address_country\` text DEFAULT 'United Kingdom',
  	\`version_address_map_url\` text,
  	\`version_location_lat\` numeric,
  	\`version_location_lng\` numeric,
  	\`version_regatta_location_lat\` numeric,
  	\`version_regatta_location_lng\` numeric,
  	\`version_sender_name\` text DEFAULT 'Sudbury Rowing Club',
  	\`version_sender_email\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`version_club_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_club_version_club_logo_idx\` ON \`_site_settings_v\` (\`version_club_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`ALTER TABLE \`regatta\` ADD \`venue_name\` text;`)
  await db.run(sql`ALTER TABLE \`regatta\` ADD \`venue_street\` text;`)
  await db.run(sql`ALTER TABLE \`regatta\` ADD \`venue_town\` text;`)
  await db.run(sql`ALTER TABLE \`regatta\` ADD \`venue_county\` text;`)
  await db.run(sql`ALTER TABLE \`regatta\` ADD \`venue_postcode\` text;`)
  await db.run(sql`ALTER TABLE \`regatta\` ADD \`live_results_url\` text;`)
  await db.run(sql`ALTER TABLE \`regatta\` ADD \`testimonials_section_title\` text DEFAULT 'Feedback';`)
  await db.run(sql`ALTER TABLE \`regatta\` ADD \`testimonials_section_description\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_socials\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_socials\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
  await db.run(sql`ALTER TABLE \`regatta\` DROP COLUMN \`venue_name\`;`)
  await db.run(sql`ALTER TABLE \`regatta\` DROP COLUMN \`venue_street\`;`)
  await db.run(sql`ALTER TABLE \`regatta\` DROP COLUMN \`venue_town\`;`)
  await db.run(sql`ALTER TABLE \`regatta\` DROP COLUMN \`venue_county\`;`)
  await db.run(sql`ALTER TABLE \`regatta\` DROP COLUMN \`venue_postcode\`;`)
  await db.run(sql`ALTER TABLE \`regatta\` DROP COLUMN \`live_results_url\`;`)
  await db.run(sql`ALTER TABLE \`regatta\` DROP COLUMN \`testimonials_section_title\`;`)
  await db.run(sql`ALTER TABLE \`regatta\` DROP COLUMN \`testimonials_section_description\`;`)
}
