import { spawnSync } from "node:child_process";

const scripts = [
  "scripts/migrate/safety-status.ts",
  "scripts/migrate/safety.ts",
];

for (const script of scripts) {
  console.log(`\n── running ${script} ──`);
  const result = spawnSync("bun", ["run", script], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error(`${script} failed with exit code ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

console.log("\n[all] done");
