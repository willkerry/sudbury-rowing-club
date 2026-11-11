// Turns the newest `turbo run --summarize` file into the job summary: type
// errors, per-package test results and every task's status, cache and time.
// It also annotates TypeScript errors with paths from the repository root;
// turbo prefixes task output with the package name, which stops setup-node's
// tsc problem matcher resolving them.
//
// Usage: node scripts/ci/turbo-report.ts [title]
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  codeBlock,
  details,
  escapeData,
  escapeProperty,
  fileLink,
  formatDuration,
  heading,
  headline,
  plural,
  stripAnsi,
  table,
  writeSummary,
} from "./summary.ts";

type Task = {
  cache?: { status: "HIT" | "MISS"; timeSaved?: number };
  directory: string;
  execution?: { endTime: number; exitCode?: number; startTime: number };
  logFile?: string;
  package: string;
  task: string;
  taskId: string;
};

type RunSummary = {
  execution: { endTime: number; startTime: number };
  tasks: Task[];
};

type TscError = {
  code: string;
  column: number;
  line: number;
  message: string;
  path: string;
  task: Task;
};

type TestResult = {
  duration?: string;
  files?: string;
  task: Task;
  tests?: string;
};

const runsDir = ".turbo/runs";
const title = process.argv[2] ?? "Turbo";

const latestSummary = (): RunSummary | undefined => {
  if (!existsSync(runsDir)) return;

  const [latest] = readdirSync(runsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => join(runsDir, name))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);

  return latest ? JSON.parse(readFileSync(latest, "utf8")) : undefined;
};

const readLog = (task: Task) =>
  task.logFile && existsSync(task.logFile)
    ? stripAnsi(readFileSync(task.logFile, "utf8")).split("\n")
    : [];

// tsc prints `file(1,2): error TS1: …` when piped and `file:1:2 - error TS1: …`
// with --pretty, which FORCE_COLOR turns on.
const tscErrors = [
  /^(?<file>[^\s(][^(]*)\((?<line>\d+),(?<col>\d+)\): error (?<code>TS\d+): (?<message>.*)$/,
  /^(?<file>\S[^:]*):(?<line>\d+):(?<col>\d+) - error (?<code>TS\d+): (?<message>.*)$/,
];

const parseTypeErrors = (task: Task): TscError[] =>
  readLog(task).flatMap((line) => {
    for (const pattern of tscErrors) {
      const groups = pattern.exec(line)?.groups;
      if (!groups) continue;

      return [
        {
          code: groups.code,
          column: Number(groups.col),
          line: Number(groups.line),
          message: groups.message.trim(),
          path: join(task.directory, groups.file),
          task,
        },
      ];
    }

    return [];
  });

// Vitest ends with lines like `Test Files  1 failed | 27 passed (28)`.
const vitestLine = (lines: string[], label: string) => {
  const line = lines.find((text) => text.trim().startsWith(label));

  return line?.trim().slice(label.length).trim();
};

const parseTests = (task: Task): TestResult => {
  const lines = readLog(task);

  return {
    duration: vitestLine(lines, "Duration")?.split(" ")[0],
    files: vitestLine(lines, "Test Files"),
    task,
    tests: vitestLine(lines, "Tests"),
  };
};

const passedCount = /(\d+) passed/;
const failedCount = /(\d+) failed/;

const total = (results: TestResult[], pattern: RegExp) =>
  results.reduce(
    (sum, result) => sum + Number(pattern.exec(result.tests ?? "")?.[1] ?? 0),
    0,
  );

const taskIcon = (task: Task) => {
  if (task.execution?.exitCode) return "❌";
  if (task.cache?.status === "HIT") return "⚡";

  return "✅";
};

const taskDuration = (task: Task) =>
  task.execution
    ? formatDuration(task.execution.endTime - task.execution.startTime)
    : "–";

const summary = latestSummary();

if (!summary) {
  writeSummary(
    `${heading("fail", title)}\n\nTurbo didn't write a run summary. See the job log.`,
  );
  process.exit(0);
}

const { execution, tasks } = summary;
const failed = tasks.filter((task) => task.execution?.exitCode);
const hits = tasks.filter((task) => task.cache?.status === "HIT");
const saved = tasks.reduce(
  (total, task) => total + (task.cache?.timeSaved ?? 0),
  0,
);

const typeErrors = failed
  .filter((task) => task.task === "type-check")
  .flatMap(parseTypeErrors);

for (const error of typeErrors) {
  console.log(
    `::error file=${escapeProperty(error.path)},line=${error.line},col=${error.column},title=${escapeProperty(`${error.code} (${error.task.package})`)}::${escapeData(error.message)}`,
  );
}

const testResults = tasks
  .filter((task) => task.task === "test")
  .map(parseTests)
  .sort((a, b) => a.task.package.localeCompare(b.task.package));

const passedTests = total(testResults, passedCount);
const failedTests = total(testResults, failedCount);

// Type-check failures are covered by the type errors table; show the log for
// any other failure, or a type-check whose errors couldn't be parsed.
const unexplained = failed.filter(
  (task) =>
    task.task !== "type-check" ||
    !typeErrors.some((error) => error.task === task),
);

const sections = [
  typeErrors.length
    ? details(
        `${typeErrors.length} TypeScript error${typeErrors.length === 1 ? "" : "s"}`,
        table(
          ["Code", "Location", "Message"],
          typeErrors.map((error) => [
            `\`${error.code}\``,
            fileLink(error.path, error.line),
            error.message,
          ]),
        ),
        true,
      )
    : "",
  ...unexplained.map((task) =>
    details(
      `❌ <code>${task.taskId}</code> output (last 40 lines)`,
      codeBlock(readLog(task).slice(-40).join("\n")),
      true,
    ),
  ),
  testResults.length
    ? details(
        `Tests in ${testResults.length} package${testResults.length === 1 ? "" : "s"}`,
        table(
          ["", "Package", "Files", "Tests", "Duration"],
          testResults.map((result) => [
            taskIcon(result.task),
            `\`${result.task.package}\``,
            result.files ?? "–",
            result.tests ?? "–",
            result.duration ?? "–",
          ]),
        ),
        failedTests > 0,
      )
    : "",
  details(
    `All ${tasks.length} tasks`,
    table(
      ["", "Package", "Task", "Cache", "Duration"],
      [...tasks]
        .sort(
          (a, b) =>
            Number(Boolean(b.execution?.exitCode)) -
              Number(Boolean(a.execution?.exitCode)) ||
            a.taskId.localeCompare(b.taskId),
        )
        .map((task) => [
          taskIcon(task),
          `\`${task.package}\``,
          task.task,
          task.cache?.status ?? "–",
          taskDuration(task),
        ]),
    ),
  ),
].filter(Boolean);

writeSummary(
  [
    heading(failed.length ? "fail" : "pass", title),
    headline([
      `**${tasks.length - failed.length}/${tasks.length}** tasks passed`,
      `**${hits.length}** from cache${hits.length === tasks.length ? " (full turbo)" : ""}`,
      `${formatDuration(execution.endTime - execution.startTime)} wall time`,
      saved > 0 && `${formatDuration(saved)} saved by the cache`,
      typeErrors.length > 0 && plural(typeErrors.length, "type error"),
      testResults.length > 0 &&
        `**${passedTests}** tests passed${failedTests ? `, **${failedTests}** failed` : ""}`,
    ]),
    ...sections,
  ].join("\n\n"),
);
