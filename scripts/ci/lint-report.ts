// Usage: node scripts/ci/lint-report.ts <oxlint-report.json> <oxfmt-list-different.txt>
import {
  annotate,
  details,
  fileLink,
  formatDuration,
  heading,
  plural,
  readIfExists,
  readJson,
  type Status,
  table,
  writeSummary,
} from "./utils.ts";

type Diagnostic = {
  code?: string;
  filename: string;
  labels?: { span: { column: number; line: number } }[];
  message: string;
  severity: "error" | "warning" | "advice";
};

type Report = {
  diagnostics: Diagnostic[];
  number_of_files: number;
  start_time: number;
};

const [reportPath, unformattedPath] = process.argv.slice(2);

const report = readJson<Report>(reportPath);

if (!report) {
  writeSummary(
    `${heading("fail", "Lint")}\n\nOxlint didn't produce a report. See the job log.`,
  );
  process.exit(0);
}

const unformatted = (readIfExists(unformattedPath) ?? "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const { diagnostics } = report;

const severityIcon: Record<Diagnostic["severity"], string> = {
  advice: "💡",
  error: "❌",
  warning: "⚠️",
};

const severityOrder = ["error", "warning", "advice"];

const errors =
  diagnostics.filter((d) => d.severity === "error").length + unformatted.length;
const warnings = diagnostics.filter((d) => d.severity === "warning").length;

let status: Status = "pass";
if (warnings) status = "warn";
if (errors) status = "fail";

for (const diagnostic of diagnostics) {
  const start = diagnostic.labels?.[0]?.span;

  annotate(
    diagnostic.severity === "error" ? "error" : "warning",
    diagnostic.message,
    {
      col: start?.column,
      file: diagnostic.filename,
      line: start?.line,
      title: diagnostic.code ? `oxlint ${diagnostic.code}` : "oxlint",
    },
  );
}

for (const file of unformatted) {
  annotate("error", "File isn't formatted. Run `pnpm check`.", {
    file,
    title: "oxfmt",
  });
}

const rows = [
  ...[...diagnostics]
    .sort(
      (a, b) =>
        severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity) ||
        a.filename.localeCompare(b.filename),
    )
    .map((diagnostic) => [
      severityIcon[diagnostic.severity],
      diagnostic.code ? `\`${diagnostic.code}\`` : "–",
      fileLink(diagnostic.filename, diagnostic.labels?.[0]?.span.line),
      diagnostic.message,
    ]),
  ...unformatted.map((file) => [
    "❌",
    "`oxfmt`",
    fileLink(file),
    "File isn't formatted",
  ]),
];

const markdown = [
  heading(status, "Lint", [
    errors > 0 && plural(errors, "error"),
    warnings > 0 && plural(warnings, "warning"),
    `${report.number_of_files} files in ${formatDuration(report.start_time * 1000)}`,
  ]),
  "",
  rows.length
    ? details(
        `${rows.length} problem${rows.length === 1 ? "" : "s"}`,
        table(["", "Rule", "Location", "Message"], rows),
        status === "fail",
      )
    : "",
].join("\n");

writeSummary(markdown);
