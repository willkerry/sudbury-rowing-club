import { appendFileSync } from "node:fs";

export type Status = "pass" | "warn" | "fail";

const icons: Record<Status, string> = { fail: "❌", pass: "✅", warn: "⚠️" };

export const icon = (status: Status) => icons[status];

export const heading = (status: Status, title: string) =>
  `### ${icon(status)} ${title}`;

export const headline = (parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" · ");

export const plural = (count: number, noun: string) =>
  `**${count}** ${noun}${count === 1 ? "" : "s"}`;

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

// biome-ignore lint/suspicious/noControlCharactersInRegex: matches ANSI escapes
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

export const escapeData = (value: string) =>
  value.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");

export const escapeProperty = (value: string) =>
  escapeData(value).replaceAll(":", "%3A").replaceAll(",", "%2C");

export const writeSummary = (markdown: string) => {
  const path = process.env.GITHUB_STEP_SUMMARY;

  if (path) appendFileSync(path, `${markdown.trimEnd()}\n\n`);
  else console.log(markdown);
};
