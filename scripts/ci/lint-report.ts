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
const title = "Lint and format";

const report = readJson<Report>(reportPath);

if (!report) {
  writeSummary(
    `${heading("fail", title)}\n\nOxlint didn't produce a report. See the job log.`,
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

const annotationLevel = {
  advice: "notice",
  error: "error",
  warning: "warning",
} as const;

const severityOrder = ["error", "warning", "advice"];

const count = (severity: Diagnostic["severity"]) =>
  diagnostics.filter((d) => d.severity === severity).length;

const errors = count("error") + unformatted.length;
const warnings = count("warning");
const advice = count("advice");

let status: Status = "pass";
if (warnings) status = "warn";
if (errors) status = "fail";

for (const diagnostic of diagnostics) {
  const start = diagnostic.labels?.[0]?.span;

  annotate(annotationLevel[diagnostic.severity], diagnostic.message, {
    col: start?.column,
    file: diagnostic.filename,
    line: start?.line,
    title: diagnostic.code ? `oxlint ${diagnostic.code}` : "oxlint",
  });
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

const lintErrors = errors - unformatted.length;

const markdown = [
  heading(status, title, [
    rows.length === 0 && "No problems",
    lintErrors > 0 && plural(lintErrors, "error"),
    warnings > 0 && plural(warnings, "warning"),
    advice > 0 && plural(advice, "suggestion"),
    unformatted.length > 0 && plural(unformatted.length, "unformatted file"),
    `${report.number_of_files} files linted in ${formatDuration(report.start_time * 1000)}`,
  ]),
  rows.length
    ? details(
        plural(rows.length, "problem"),
        table(["Level", "Rule", "Location", "Message"], rows),
        status === "fail",
      )
    : "",
]
  .filter(Boolean)
  .join("\n\n");

writeSummary(markdown);
