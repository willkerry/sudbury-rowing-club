// Turns the newest `turbo run --summarize` file into a job summary table and
// GitHub annotations for TypeScript errors. Turbo prefixes task output with
// the package name, which stops setup-node's tsc problem matcher resolving
// file paths, so this reads each failed task's log and prefixes its directory.
//
// Usage: node scripts/ci/turbo-report.ts [title]
import {
  appendFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { join } from "node:path";

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

const escapeData = (value: string) =>
  value.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");

const escapeProperty = (value: string) =>
  escapeData(value).replaceAll(":", "%3A").replaceAll(",", "%2C");

const formatDuration = (ms: number) =>
  ms >= 60_000
    ? `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`
    : `${(ms / 1000).toFixed(1)}s`;

const tscError =
  /^(?<file>[^\s(][^(]*)\((?<line>\d+),(?<col>\d+)\): error (?<code>TS\d+): (?<message>.*)$/;

const readLog = (task: Task) =>
  task.logFile && existsSync(task.logFile)
    ? readFileSync(task.logFile, "utf8").split("\n")
    : [];

const annotate = (task: Task) => {
  let count = 0;

  for (const line of readLog(task)) {
    const groups = tscError.exec(line.trim())?.groups;
    if (!groups) continue;

    const path = join(task.directory, groups.file);
    console.log(
      `::error file=${escapeProperty(path)},line=${groups.line},col=${groups.col},title=${escapeProperty(`${groups.code} (${task.package})`)}::${escapeData(groups.message)}`,
    );
    count++;
  }

  return count;
};

const icon = (task: Task) => {
  if (task.execution?.exitCode) return "❌";
  if (task.cache?.status === "HIT") return "⚡";

  return "✅";
};

const summary = latestSummary();

if (!summary) {
  console.log("No turbo run summary found");
  process.exit(0);
}

const { execution, tasks } = summary;
const failed = tasks.filter((task) => task.execution?.exitCode);
const hits = tasks.filter((task) => task.cache?.status === "HIT");
const saved = tasks.reduce(
  (total, task) => total + (task.cache?.timeSaved ?? 0),
  0,
);

let annotations = 0;
for (const task of failed) annotations += annotate(task);

const rows = [...tasks]
  .sort(
    (a, b) =>
      Number(Boolean(b.execution?.exitCode)) -
        Number(Boolean(a.execution?.exitCode)) ||
      a.taskId.localeCompare(b.taskId),
  )
  .map((task) => {
    const duration = task.execution
      ? formatDuration(task.execution.endTime - task.execution.startTime)
      : "–";

    return `| ${icon(task)} | \`${task.package}\` | ${task.task} | ${task.cache?.status ?? "–"} | ${duration} |`;
  });

const failureDetails = failed.map((task) => {
  const tail = readLog(task).slice(-60).join("\n");

  return `<details><summary><code>${task.taskId}</code> output (last 60 lines)</summary>\n\n\`\`\`text\n${tail}\n\`\`\`\n\n</details>`;
});

const headline = [
  `**${tasks.length - failed.length}/${tasks.length}** tasks passed`,
  `**${hits.length}** from cache${hits.length === tasks.length ? " (full turbo)" : ""}`,
  `${formatDuration(execution.endTime - execution.startTime)} wall time`,
  saved ? `${formatDuration(saved)} saved by the cache` : undefined,
  annotations
    ? `${annotations} TypeScript error${annotations === 1 ? "" : "s"} annotated`
    : undefined,
]
  .filter(Boolean)
  .join(" · ");

const markdown = [
  `### ${failed.length ? "❌" : "✅"} ${title}`,
  "",
  headline,
  "",
  ...failureDetails,
  "",
  "<details><summary>All tasks</summary>",
  "",
  "| | Package | Task | Cache | Duration |",
  "| - | - | - | - | - |",
  ...rows,
  "",
  "</details>",
  "",
].join("\n");

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
} else {
  console.log(markdown);
}
