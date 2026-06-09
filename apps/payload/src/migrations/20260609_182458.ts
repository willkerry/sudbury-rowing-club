import {
  type MigrateDownArgs,
  type MigrateUpArgs,
  sql,
} from "@payloadcms/db-d1-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`);
  await db.run(sql`CREATE TABLE \`__new_safety_notices\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`body\` text,
  	\`document_title\` text,
  	\`document_document_id\` text(36),
  	\`link\` text,
  	\`pin\` integer DEFAULT false,
  	\`date\` text,
  	\`sanity_doc_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`document_document_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`INSERT INTO \`__new_safety_notices\`("id", "title", "slug", "body", "document_title", "document_document_id", "link", "pin", "date", "sanity_doc_id", "updated_at", "created_at") SELECT "id", "title", "slug", "body", "document_title", "document_document_id", "link", "pin", "date", "sanity_doc_id", "updated_at", "created_at" FROM \`safety_notices\`;`,
  );
  await db.run(sql`DROP TABLE \`safety_notices\`;`);
  await db.run(
    sql`ALTER TABLE \`__new_safety_notices\` RENAME TO \`safety_notices\`;`,
  );
  await db.run(sql`PRAGMA foreign_keys=ON;`);
  await db.run(
    sql`CREATE UNIQUE INDEX \`safety_notices_slug_idx\` ON \`safety_notices\` (\`slug\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`safety_notices_document_document_document_idx\` ON \`safety_notices\` (\`document_document_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`safety_notices_sanity_doc_id_idx\` ON \`safety_notices\` (\`sanity_doc_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`safety_notices_updated_at_idx\` ON \`safety_notices\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`safety_notices_created_at_idx\` ON \`safety_notices\` (\`created_at\`);`,
  );
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`);
  await db.run(sql`CREATE TABLE \`__new_safety_notices\` (
  	\`body\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`date\` text,
  	\`document_document_id\` text(36),
  	\`document_title\` text,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`link\` text,
  	\`pin\` integer,
  	\`title\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`document_document_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`INSERT INTO \`__new_safety_notices\`("body", "created_at", "date", "document_document_id", "document_title", "id", "link", "pin", "title", "updated_at") SELECT "body", "created_at", "date", "document_document_id", "document_title", "id", "link", "pin", "title", "updated_at" FROM \`safety_notices\`;`,
  );
  await db.run(sql`DROP TABLE \`safety_notices\`;`);
  await db.run(
    sql`ALTER TABLE \`__new_safety_notices\` RENAME TO \`safety_notices\`;`,
  );
  await db.run(sql`PRAGMA foreign_keys=ON;`);
  await db.run(
    sql`CREATE INDEX \`safety_notices_created_at_idx\` ON \`safety_notices\` (\`created_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`safety_notices_document_document_document_idx\` ON \`safety_notices\` (\`document_document_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`safety_notices_updated_at_idx\` ON \`safety_notices\` (\`updated_at\`);`,
  );
}
