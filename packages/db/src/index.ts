import { type AnyD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export { inflightContacts } from "./schema";

export const createDb = (database: AnyD1Database) =>
  drizzle(database, { schema });

export type Database = ReturnType<typeof createDb>;
