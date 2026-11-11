// Usage: node scripts/ci/smoke.ts <base-url> [markdown-output-path]
import { writeFileSync } from "node:fs";

type Route = { path: string; type: string };

type Result = {
  attempt: number;
  contentType: string;
  error?: string;
  ms: number;
  ok: boolean;
  path: string;
  status: number | "error";
};

const [baseUrl, outputPath] = process.argv.slice(2);

if (!baseUrl) {
  console.error("Usage: smoke.ts <base-url> [markdown-output-path]");
  process.exit(2);
}

const routes: Route[] = [
  { path: "/", type: "text/html" },
  { path: "/news", type: "text/html" },
  { path: "/contact", type: "text/html" },
  { path: "/api/events.ics", type: "text/calendar" },
  { path: "/sitemap.xml", type: "application/xml" },
  { path: "/robots.txt", type: "text/plain" },
];

const attempts = 5;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (
  { path, type }: Route,
  attempt: number,
): Promise<Result> => {
  const started = performance.now();
  const elapsed = () => Math.round(performance.now() - started);

  try {
    const response = await fetch(new URL(path, baseUrl), {
      headers: { "user-agent": "sudbury-ci-smoke-test" },
      redirect: "manual",
      signal: AbortSignal.timeout(20_000),
    });
    const contentType = response.headers.get("content-type") ?? "";
    await response.arrayBuffer();

    return {
      attempt,
      contentType,
      ms: elapsed(),
      ok: response.status === 200 && contentType.startsWith(type),
      path,
      status: response.status,
    };
  } catch (error) {
    return {
      attempt,
      contentType: "",
      error: error instanceof Error ? error.message : String(error),
      ms: elapsed(),
      ok: false,
      path,
      status: "error",
    };
  }
};

const check = async (route: Route) => {
  let result = await request(route, 1);

  for (let attempt = 2; !result.ok && attempt <= attempts; attempt++) {
    await sleep((attempt - 1) * 3000);
    result = await request(route, attempt);
  }

  return result;
};

const results = await Promise.all(routes.map(check));
const passed = results.filter((result) => result.ok).length;
const errorSuffix = (result: Result) =>
  result.error ? ` (${result.error})` : "";

for (const result of results) {
  console.log(
    `${result.ok ? "ok  " : "FAIL"} ${result.status} ${result.ms}ms ${result.path} ${result.contentType}${errorSuffix(result)}`,
  );

  if (!result.ok) {
    console.log(
      `::error title=Smoke test failed::${result.path} returned ${result.status}${errorSuffix(result)} after ${result.attempt} attempts`,
    );
  }
}

const markdown = [
  `**${passed}/${results.length}** routes healthy on ${baseUrl}`,
  "",
  "| | Route | Status | Time | Content type |",
  "| - | - | - | - | - |",
  ...results.map(
    (result) =>
      `| ${result.ok ? "✅" : "❌"} | [\`${result.path}\`](${new URL(result.path, baseUrl)}) | ${result.status} | ${result.ms} ms | ${result.contentType.split(";")[0] || "–"} |`,
  ),
  "",
].join("\n");

if (outputPath) writeFileSync(outputPath, markdown);

process.exit(passed === results.length ? 0 : 1);
