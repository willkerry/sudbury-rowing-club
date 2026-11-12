import { appendFileSync, existsSync, readFileSync } from "node:fs";

export type Status = "pass" | "warn" | "fail";

const icons: Record<Status, string> = { fail: "❌", pass: "✅", warn: "⚠️" };

export const icon = (status: Status) => icons[status];

type Part = string | false | undefined;

// One quiet line: an icon only when something needs attention, details in small type.
export const heading = (status: Status, title: string, parts: Part[] = []) => {
  const meta = parts.filter(Boolean).join(" · ");

  return [
    status === "pass" ? "" : `${icon(status)} `,
    `**${title}**`,
    meta ? ` <sub>${meta}</sub>` : "",
  ].join("");
};

export const plural = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

export const failedMark = (failed: boolean) => (failed ? "❌ " : "");

export const formatDuration = (ms: number) =>
  ms >= 60_000
    ? `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`
    : `${(ms / 1000).toFixed(1)}s`;

const cell = (value: string) =>
  value.replaceAll("|", "\\|").replaceAll("\n", " ");

export const table = (headers: string[], rows: string[][]) =>
  [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "-").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
  ].join("\n");

export const details = (summary: string, body: string, open = false) =>
  `<details${open ? " open" : ""}><summary>${summary}</summary>\n\n${body}\n\n</details>`;

// oxlint-disable-next-line no-control-regex -- matches ANSI escapes
const ansi = /\u001b\[[0-9;]*[A-Za-z]/g;

export const stripAnsi = (text: string) => text.replace(ansi, "");

export const codeBlock = (text: string, language = "text") =>
  `\`\`\`${language}\n${text.trimEnd()}\n\`\`\``;

export const fileLink = (path: string, line?: number) => {
  const { GITHUB_REPOSITORY, GITHUB_SERVER_URL, SHA, GITHUB_SHA } = process.env;
  const label = `\`${path}${line ? `:${line}` : ""}\``;
  const sha = SHA ?? GITHUB_SHA;

  if (!(GITHUB_REPOSITORY && sha)) return label;

  const url = `${GITHUB_SERVER_URL ?? "https://github.com"}/${GITHUB_REPOSITORY}/blob/${sha}/${path}${line ? `#L${line}` : ""}`;

  return `[${label}](${url})`;
};

const escapeData = (value: string) =>
  value.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");

const escapeProperty = (value: string) =>
  escapeData(value).replaceAll(":", "%3A").replaceAll(",", "%2C");

type AnnotationProperties = {
  col?: number;
  file?: string;
  line?: number;
  title?: string;
};

export const annotate = (
  level: "error" | "warning" | "notice",
  message: string,
  properties: AnnotationProperties = {},
) => {
  const props = Object.entries(properties)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${escapeProperty(String(value))}`)
    .join(",");

  console.log(`::${level}${props ? ` ${props}` : ""}::${escapeData(message)}`);
};

export const readIfExists = (path: string | undefined) =>
  path && existsSync(path) ? readFileSync(path, "utf8") : undefined;

export const readJson = <T>(path: string | undefined): T | undefined => {
  const text = readIfExists(path);

  return text ? JSON.parse(text) : undefined;
};

export const setOutput = (
  values: Record<string, string | number | undefined>,
) => {
  const lines = Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${value}`);

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${lines.join("\n")}\n`);
  }
  console.log(lines.join("\n"));
};

export const writeSummary = (markdown: string) => {
  const path = process.env.GITHUB_STEP_SUMMARY;

  if (path) appendFileSync(path, `${markdown.trimEnd()}\n\n`);
  else console.log(markdown);
};
