// Usage: node scripts/ci/web-report.ts outputs <stats.json>
//        node scripts/ci/web-report.ts report <markdown-output-path>
import {
  appendFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { details, heading, table } from "./summary.ts";

type BundleSize = { gzip_bytes: number; raw_bytes: number };

type Url = string | { url?: string; hostname?: string };

type WranglerEntry = {
  bundle_size?: BundleSize;
  deployment_id?: string;
  deployment_urls?: Url[];
  preview_alias_url?: string;
  preview_url?: string;
  preview_urls?: Url[];
  timestamp?: string;
  type: string;
  version_id?: string;
  worker_name?: string | null;
};

type Stats = BundleSize & { sha?: string; version_id?: string };

const WORKER = "sudbury-web";
const GZIP_BUDGET = 3 * 1024 * 1024;

const [command, target] = process.argv.slice(2);
const env = process.env;
const production = env.MODE === "production";

const readIfExists = (path: string | undefined) =>
  path && existsSync(path) ? readFileSync(path, "utf8") : undefined;

const readStats = (path: string | undefined): Stats | undefined => {
  const text = readIfExists(path);

  return text ? JSON.parse(text) : undefined;
};

const wranglerEntries = (): WranglerEntry[] => {
  const dir = env.WRANGLER_OUTPUT_FILE_DIRECTORY;
  if (!(dir && existsSync(dir))) return [];

  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .flatMap((name) =>
      readFileSync(join(dir, name), "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line): WranglerEntry => JSON.parse(line)),
    )
    .sort(
      (a, b) => Date.parse(a.timestamp ?? "0") - Date.parse(b.timestamp ?? "0"),
    );
};

const formatBytes = (bytes: number) => {
  const kib = bytes / 1024;

  return kib >= 1024
    ? `${(kib / 1024).toFixed(2)} MiB`
    : `${kib.toFixed(1)} KiB`;
};

const formatDelta = (bytes: number) => {
  if (!bytes) return "no change";

  return `${bytes > 0 ? "+" : "−"}${formatBytes(Math.abs(bytes))}`;
};

const percentOfBudget = (bytes: number) => (bytes / GZIP_BUDGET) * 100;

const setOutput = (values: Record<string, string | number | undefined>) => {
  const lines = Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${value}`);

  if (env.GITHUB_OUTPUT) {
    appendFileSync(env.GITHUB_OUTPUT, `${lines.join("\n")}\n`);
  }
  console.log(lines.join("\n"));
};

const toUrl = (url: Url) =>
  typeof url === "string"
    ? url
    : (url.url ?? (url.hostname && `https://${url.hostname}`));

const firstUrl = (urls: Url[] | undefined) => {
  const all = (urls ?? []).map(toUrl).filter((url) => url !== undefined);

  return all.find((url) => !url.includes(".workers.dev")) ?? all[0];
};

const kib = 1024;
const sizeLine = /Total Upload: ([\d.]+) KiB \/ gzip: ([\d.]+) KiB/;

const sizeFromLog = (): BundleSize | undefined => {
  const match = sizeLine.exec(readIfExists(env.SIZE_LOG) ?? "");
  if (!match) return;

  return {
    gzip_bytes: Math.round(Number(match[2]) * kib),
    raw_bytes: Math.round(Number(match[1]) * kib),
  };
};

const outputs = (statsPath: string | undefined) => {
  const entries = wranglerEntries().filter(
    (entry) =>
      entry.worker_name === WORKER &&
      ["deploy", "preview", "version-upload"].includes(entry.type),
  );
  const latest = entries.at(-1);

  if (!latest) {
    console.log(
      `::warning title=No wrangler output::No ${WORKER} upload found in wrangler's output files`,
    );

    return;
  }

  const size =
    entries.findLast((entry) => entry.bundle_size)?.bundle_size ??
    sizeFromLog();

  if (size && percentOfBudget(size.gzip_bytes) >= 90) {
    console.log(
      `::warning title=Worker size::${WORKER} is ${formatBytes(size.gzip_bytes)} gzipped, ${percentOfBudget(size.gzip_bytes).toFixed(0)}% of the ${formatBytes(GZIP_BUDGET)} free plan limit`,
    );
  }

  const versionId = latest.version_id ?? latest.deployment_id;
  const stableUrl = firstUrl(latest.preview_urls) ?? latest.preview_alias_url;
  const exactUrl = firstUrl(latest.deployment_urls) ?? latest.preview_url;

  if (size && statsPath) {
    const stats: Stats = {
      ...size,
      sha: env.GITHUB_SHA,
      version_id: versionId,
    };
    writeFileSync(statsPath, JSON.stringify(stats));
  }

  setOutput({
    gzip_bytes: size?.gzip_bytes,
    preview_url: exactUrl,
    raw_bytes: size?.raw_bytes,
    url: production ? env.SITE_URL : (stableUrl ?? exactUrl),
    version_id: versionId,
  });
};

const sizeRow = (stats: Stats, base: Stats | undefined) => {
  const percent = percentOfBudget(stats.gzip_bytes).toFixed(0);
  const delta = base
    ? ` · ${formatDelta(stats.gzip_bytes - base.gzip_bytes)} vs \`master\``
    : "";

  return `${formatBytes(stats.gzip_bytes)} gzip (${percent}% of ${formatBytes(GZIP_BUDGET)}), ${formatBytes(stats.raw_bytes)} raw${delta}`;
};

const migrationsRow = (text: string | undefined) => {
  if (text === undefined) return;

  const pending = text.split("\n").filter(Boolean);
  if (!pending.length) return "Production is up to date";

  const names = pending.map((name) => `\`${name}\``).join(", ");

  return `${production ? "Applied" : "Applies on merge"}: ${names}`;
};

const meter = (stats: Stats | undefined) => {
  if (!stats) return [];

  const filled = Math.min(
    20,
    Math.round((percentOfBudget(stats.gzip_bytes) / 100) * 20),
  );

  return [
    "",
    `\`${"█".repeat(filled)}${"░".repeat(20 - filled)}\` Worker size against the free plan limit`,
  ];
};

const report = (outputPath: string) => {
  const stats = readStats(env.STATS_FILE);
  const base = readStats(env.BASE_STATS_FILE);
  const smoke = readIfExists(env.SMOKE_FILE);
  const repoUrl = `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}`;
  const shortSha = env.SHA?.slice(0, 7);
  const failed = env.JOB_STATUS && env.JOB_STATUS !== "success";
  const subject = production ? "Production deploy" : "Preview";

  const title = failed
    ? heading("fail", `${subject} failed`)
    : heading("pass", production ? "Deployed to production" : "Preview ready");

  const rows: [string, string | undefined][] = [
    [production ? "Site" : "Preview", env.URL],
    ["Version URL", env.VERSION_URL],
    ["Commit", shortSha && `[\`${shortSha}\`](${repoUrl}/commit/${env.SHA})`],
    ["Worker version", env.VERSION_ID && `\`${env.VERSION_ID}\``],
    ["Worker size", stats && sizeRow(stats, base)],
    ["D1 migrations", migrationsRow(readIfExists(env.MIGRATIONS_FILE))],
    [
      "Build",
      `[Run #${env.GITHUB_RUN_NUMBER}](${repoUrl}/actions/runs/${env.GITHUB_RUN_ID})`,
    ],
  ];

  const smokeDetails = smoke
    ? details("Smoke test", smoke.trimEnd(), smoke.includes("❌"))
    : "";

  const markdown = [
    title,
    "",
    table(
      ["", ""],
      rows
        .filter((row): row is [string, string] => Boolean(row[1]))
        .map(([label, value]) => [`**${label}**`, value]),
    ),
    ...meter(stats),
    "",
    smokeDetails,
    production
      ? ""
      : "\nPreviews share production's KV, D1 and email bindings, so the contact form sends real email.",
    "",
  ].join("\n");

  writeFileSync(outputPath, markdown);
  if (env.GITHUB_STEP_SUMMARY)
    appendFileSync(env.GITHUB_STEP_SUMMARY, markdown);
  console.log(markdown);
};

if (command === "outputs") {
  outputs(target);
} else if (command === "report" && target) {
  report(target);
} else {
  console.error(
    "Usage: web-report.ts outputs <stats.json> | report <output.md>",
  );
  process.exit(2);
}
