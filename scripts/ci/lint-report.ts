// Usage: node scripts/ci/lint-report.ts <biome-report.json>
import { existsSync, readFileSync } from "node:fs";
import {
  details,
  fileLink,
  formatDuration,
  heading,
  headline,
  plural,
  type Status,
  table,
  writeSummary,
} from "./summary.ts";

type Diagnostic = {
  category?: string;
  location?: { path?: string; start?: { line: number } };
  message: string;
  severity: "error" | "warning" | "information" | "hint" | "fatal";
};

type Report = {
  diagnostics: Diagnostic[];
  summary: {
    duration: number;
    errors: number;
    infos: number;
    scannerDuration?: number;
    unchanged: number;
    changed: number;
    warnings: number;
  };
};

const [reportPath] = process.argv.slice(2);

if (!(reportPath && existsSync(reportPath))) {
  writeSummary(
    `${heading("fail", "Lint")}\n\nBiome didn't produce a report. See the job log.`,
  );
  process.exit(0);
}

const { diagnostics, summary }: Report = JSON.parse(
  readFileSync(reportPath, "utf8"),
);

const severityIcon: Record<Diagnostic["severity"], string> = {
  error: "❌",
  fatal: "❌",
  hint: "💡",
  information: "ℹ️",
  warning: "⚠️",
};

const severityOrder = ["fatal", "error", "warning", "information", "hint"];

let status: Status = "pass";
if (summary.warnings) status = "warn";
if (summary.errors) status = "fail";

const files = summary.changed + summary.unchanged;
// Biome reports durations in nanoseconds.
const duration = (summary.scannerDuration ?? 0) + summary.duration;

const rows = [...diagnostics]
  .sort(
    (a, b) =>
      severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity) ||
      (a.location?.path ?? "").localeCompare(b.location?.path ?? ""),
  )
  .map((diagnostic) => [
    severityIcon[diagnostic.severity],
    diagnostic.category ? `\`${diagnostic.category}\`` : "–",
    diagnostic.location?.path
      ? fileLink(diagnostic.location.path, diagnostic.location.start?.line)
      : "–",
    diagnostic.message,
  ]);

const markdown = [
  heading(status, "Lint"),
  "",
  headline([
    plural(summary.errors, "error"),
    plural(summary.warnings, "warning"),
    `${files} files checked by Biome in ${formatDuration(duration / 1e6)}`,
  ]),
  "",
  rows.length
    ? details(
        `${diagnostics.length} diagnostic${diagnostics.length === 1 ? "" : "s"}`,
        table(["", "Rule", "Location", "Message"], rows),
        status === "fail",
      )
    : "",
].join("\n");

writeSummary(markdown);
