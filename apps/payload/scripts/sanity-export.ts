import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDir, "..");
for (const file of [".env.local", ".env"]) {
  loadEnv({ override: false, path: path.join(appRoot, file) });
}

const dataset =
  process.env.SANITY_DATASET ??
  process.env.SANITY_API_DATASET ??
  process.env.SANITY_STUDIO_DATASET ??
  process.env.SANITY_STUDIO_API_DATASET ??
  "production";
const projectId =
  process.env.SANITY_PROJECT_ID ??
  process.env.SANITY_API_PROJECT_ID ??
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.SANITY_STUDIO_API_PROJECT_ID;
const token =
  process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN;
const outputDir = ".sanity-export";

if (!projectId) {
  console.error(
    "Missing project id. Set SANITY_API_PROJECT_ID (or SANITY_PROJECT_ID).",
  );
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing auth token. Set SANITY_API_WRITE_TOKEN (or SANITY_AUTH_TOKEN). " +
      "Create one in https://manage.sanity.io with read access.",
  );
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const args = [
  "dlx",
  "@sanity/cli@latest",
  "dataset",
  "export",
  dataset,
  outputDir,
  "--overwrite",
];
const env = {
  ...process.env,
  SANITY_AUTH_TOKEN: token,
  SANITY_PROJECT_ID: projectId,
};

console.log(`[sanity-export] exporting dataset "${dataset}" → ${outputDir}/`);
const child = spawn("pnpm", args, { stdio: "inherit", env });
child.on("exit", (code) => process.exit(code ?? 1));
