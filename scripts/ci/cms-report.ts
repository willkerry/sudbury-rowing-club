// Usage: node scripts/ci/cms-report.ts <markdown-output-path>
import { appendFileSync, writeFileSync } from "node:fs";
import { details, heading, link, list, type Status } from "./utils.ts";
import { firstUrl, wranglerEntries } from "./wrangler.ts";

const WORKER = "sudbury-sanity-cms";

const [outputPath] = process.argv.slice(2);

if (!outputPath) {
  console.error("Usage: cms-report.ts <output.md>");
  process.exit(2);
}

const env = process.env;
const preview = wranglerEntries().findLast(
  (entry) => entry.type === "preview" && entry.worker_name === WORKER,
);
const url = firstUrl(preview?.preview_urls);
const deploymentUrl = firstUrl(preview?.deployment_urls);
const repoUrl = `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}`;
const runUrl = `${repoUrl}/actions/runs/${env.GITHUB_RUN_ID}`;
const shortSha = env.SHA?.slice(0, 7);
const failed = env.JOB_STATUS !== "success";

let status: Status = url ? "pass" : "warn";
if (failed) status = "fail";

const titles: Record<Status, string> = {
  fail: "Studio preview failed",
  pass: "Studio preview ready",
  warn: "Studio preview has no URL",
};

const headline = heading(status, titles[status], [
  (failed || !url) && `[See the log](${runUrl})`,
  url && link(url),
  shortSha && `[\`${shortSha}\`](${repoUrl}/commit/${env.SHA})`,
  env.WEB_URL && `Website: ${link(env.WEB_URL)}`,
]);

const facts = list([
  ["Deployment URL", deploymentUrl && link(deploymentUrl)],
  ["Workflow run", `[CI #${env.GITHUB_RUN_NUMBER}](${runUrl})`],
]);

const markdown = [
  headline,
  status === "warn" &&
    "Cloudflare created the preview but returned no URL. Preview hostnames only work after a production deploy of the CMS with `previews_enabled` on the `edit-preview` route, and the first certificate can take a few minutes.",
  "**This Studio edits live content.** It uses the `production` dataset, so anything you publish here appears on the website straight away. Schema changes in this PR deploy only when it merges, so the preview may show fields the live schema doesn't have yet.",
  details("Deploy details", facts),
  "",
]
  .filter((part) => part !== false)
  .join("\n\n");

writeFileSync(outputPath, markdown);
if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, markdown);
console.log(markdown);
