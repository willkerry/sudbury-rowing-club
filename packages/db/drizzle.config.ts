import { defineConfig } from "drizzle-kit";

// Wrangler applies these migrations: see `migrations_dir` in
// apps/web/wrangler.jsonc and `wrangler d1 migrations apply`.
export default defineConfig({
  dialect: "sqlite",
  out: "./migrations",
  schema: "./src/schema.ts",
});
