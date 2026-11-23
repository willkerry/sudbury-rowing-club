// Usage: node scripts/ci/web-report.ts outputs <stats.json>
//        node scripts/ci/web-report.ts report <markdown-output-path>
import { appendFileSync, writeFileSync } from "node:fs";
import type { SmokeReport } from "./smoke.ts";
import {
  annotate,
  details,
  failedMark,
  formatDuration,
  heading,
  link,
  list,
  readIfExists,
  readJson,
  setOutput,
  type Status,
  table,
} from "./utils.ts";
import {
  allUrls,
  type BundleSize,
  firstUrl,
  isWorkersDev,
  wranglerEntries,
} from "./wrangler.ts";

type Stats = BundleSize & { sha?: string; version_id?: string };

const WORKER = "sudbury-web";
const GZIP_BUDGET = 3 * 1024 * 1024;

const [command, target] = process.argv.slice(2);
const env = process.env;
const production = env.MODE === "production";

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
    annotate(
      "warning",
      `No ${WORKER} upload found in wrangler's output files`,
      { title: "No wrangler output" },
    );

    return;
  }

  const size =
    entries.findLast((entry) => entry.bundle_size)?.bundle_size ??
    sizeFromLog();

  if (size && percentOfBudget(size.gzip_bytes) >= 90) {
    annotate(
      "warning",
      `${WORKER} is ${formatBytes(size.gzip_bytes)} gzipped, ${percentOfBudget(size.gzip_bytes).toFixed(0)}% of the ${formatBytes(GZIP_BUDGET)} free plan limit`,
      { title: "Worker size" },
    );
  }

  const versionId = latest.version_id ?? latest.deployment_id;
  const stableUrl = firstUrl(latest.preview_urls) ?? latest.preview_alias_url;
  const exactUrl = firstUrl(latest.deployment_urls) ?? latest.preview_url;
  // The custom preview domain sits behind zone bot protection, which 403s CI runners
  const smokeUrl =
    allUrls(latest.preview_urls).find(isWorkersDev) ?? stableUrl ?? exactUrl;

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
    smoke_url: production ? env.SITE_URL : smokeUrl,
    url: production ? env.SITE_URL : (stableUrl ?? exactUrl),
    version_id: versionId,
  });
};

const sizeSummary = (stats: Stats, base: Stats | undefined) => {
  const percent = percentOfBudget(stats.gzip_bytes).toFixed(0);
  const delta =
    base && `${formatDelta(stats.gzip_bytes - base.gzip_bytes)} vs \`master\``;

  return [
    `${formatBytes(stats.gzip_bytes)} gzip (${percent}% of the ${formatBytes(GZIP_BUDGET)} limit)`,
    delta,
  ]
    .filter(Boolean)
    .join(", ");
};

const migrationsSummary = () => {
  if (env.MIGRATIONS_OUTCOME === "failure")
    return "Couldn't check, see the log";

  const text = readIfExists(env.MIGRATIONS_FILE);
  if (text === undefined) return;

  const pending = text.split("\n").filter(Boolean);
  if (!pending.length) return "Production is up to date";

  const names = pending.map((name) => `\`${name}\``).join(", ");

  return `${production ? "Applied" : "Apply on merge"}: ${names}`;
};

const smokeSummary = ({ results }: SmokeReport) => {
  const failures = results.filter((result) => !result.ok).length;

  return failures
    ? `${failures}/${results.length} routes failing`
    : `${results.length}/${results.length} routes healthy`;
};

const smokeTable = ({ baseUrl, results }: SmokeReport) =>
  table(
    ["Route", "Status", "Time", "Content type"],
    results.map((result) => {
      const url = new URL(result.path, baseUrl);

      return [
        `${failedMark(!result.ok)}[${result.path}](${url})`,
        result.error
          ? `${result.status} (${result.error})`
          : String(result.status),
        formatDuration(result.ms),
        result.contentType.split(";")[0] || "–",
      ];
    }),
    ["left", "right", "right", "left"],
  );

const report = (outputPath: string) => {
  const stats = readJson<Stats>(env.STATS_FILE);
  const base = readJson<Stats>(env.BASE_STATS_FILE);
  const smoke = readJson<SmokeReport>(env.SMOKE_FILE);
  const repoUrl = `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}`;
  const runUrl = `${repoUrl}/actions/runs/${env.GITHUB_RUN_ID}`;
  const shortSha = env.SHA?.slice(0, 7);
  const failed = Boolean(env.JOB_STATUS && env.JOB_STATUS !== "success");
  const smokeFailed = Boolean(smoke?.results.some((result) => !result.ok));
  const subject = production ? "Production deploy" : "Preview";

  let status: Status = "pass";
  if (stats && percentOfBudget(stats.gzip_bytes) >= 90) status = "warn";
  if (failed) status = "fail";

  const title = failed
    ? `${subject} failed`
    : production
      ? "Deployed to production"
      : "Preview ready";

  const headline = heading(status, title, [
    failed && `[See the log](${runUrl})`,
    env.URL && link(env.URL),
    shortSha && `[\`${shortSha}\`](${repoUrl}/commit/${env.SHA})`,
    stats &&
      `${formatBytes(stats.gzip_bytes)} gzip (${
        base
          ? `${formatDelta(stats.gzip_bytes - base.gzip_bytes)} vs \`master\``
          : `${percentOfBudget(stats.gzip_bytes).toFixed(0)}% of limit`
      })`,
    smoke && smokeSummary(smoke),
  ]);

  const facts = list([
    ["Version URL", env.VERSION_URL && link(env.VERSION_URL)],
    ["Worker version", env.VERSION_ID && `\`${env.VERSION_ID}\``],
    [
      "Worker size",
      stats &&
        `${sizeSummary(stats, base)}; ${formatBytes(stats.raw_bytes)} uncompressed`,
    ],
    ["D1 migrations", migrationsSummary()],
    ["Smoke test", smoke && `${smokeSummary(smoke)} on ${link(smoke.baseUrl)}`],
    ["Workflow run", `[CI #${env.GITHUB_RUN_NUMBER}](${runUrl})`],
  ]);

  const markdown = [
    headline,
    details(
      "Deploy details",
      [facts, smoke && smokeTable(smoke)].filter(Boolean).join("\n\n"),
      failed || smokeFailed,
    ),
    production
      ? ""
      : "<sub>Previews share production's KV, D1 and email bindings, so the contact form sends real email.</sub>",
    "",
  ].join("\n\n");

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
