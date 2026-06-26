import { env } from "@/env";

const FIRECRAWL_API = "https://api.firecrawl.dev/v2/scrape";

type ScrapeFormat = "rawHtml" | "markdown" | "html" | "links" | "screenshot";

type ScrapeOptions = {
  formats?: ScrapeFormat[];
  onlyMainContent?: boolean;
  waitFor?: number;
  timeout?: number;
};

type ScrapeDocument = {
  rawHtml?: string;
  markdown?: string;
  html?: string;
  links?: string[];
  metadata?: Record<string, unknown>;
};

type ScrapeResponse = {
  success: boolean;
  data?: ScrapeDocument;
  error?: string;
};

// Minimal Firecrawl client. We only ever call `scrape`, so rather than ship the
// full SDK (which drags in `axios` and a dynamically-imported `undici` for its
// WebSocket crawl-watcher — ~2 MB of dependencies), we hit the REST endpoint
// directly with the platform's native `fetch`.
const scrape = async (
  url: string,
  options: ScrapeOptions = {},
): Promise<ScrapeDocument> => {
  const response = await fetch(FIRECRAWL_API, {
    body: JSON.stringify({ url, ...options }),
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Firecrawl scrape failed (${response.status} ${response.statusText})`,
    );
  }

  const body = (await response.json()) as ScrapeResponse;

  if (!(body.success && body.data)) {
    throw new Error(
      `Firecrawl scrape failed: ${body.error ?? "unknown error"}`,
    );
  }

  return body.data;
};

export const firecrawl = { scrape };
