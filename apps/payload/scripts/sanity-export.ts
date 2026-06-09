import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";

const dataset =
  process.env.SANITY_DATASET ??
  process.env.SANITY_STUDIO_DATASET ??
  "production";
const projectId =
  process.env.SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID;
const token = process.env.SANITY_AUTH_TOKEN;
const outputDir = ".sanity-export";

if (!projectId) {
  console.error("Missing SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID).");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_AUTH_TOKEN. Create one in https://manage.sanity.io with read access.",
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
