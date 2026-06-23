import { env } from "@/env";

const FIRECRAWL_SCRAPE_ENDPOINT = "https://api.firecrawl.dev/v2/scrape";
const SCRAPE_TIMEOUT_MS = 30_000;

const isJsonContentType = (contentType: string | null): boolean =>
  (contentType ?? "").toLowerCase().includes("json");

export const fetchViaFirecrawl = async (url: string): Promise<unknown> => {
  const response = await fetch(FIRECRAWL_SCRAPE_ENDPOINT, {
    body: JSON.stringify({
      url,
      formats: ["rawHtml"],
      timeout: SCRAPE_TIMEOUT_MS,
    }),
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Firecrawl returned ${response.status} ${response.statusText} for ${url}`,
    );
  }

  const payload = (await response.json()) as {
    success?: boolean;
    data?: { rawHtml?: string; metadata?: { statusCode?: number } };
  };

  const rawHtml = payload.data?.rawHtml;
  const upstreamStatus = payload.data?.metadata?.statusCode;

  if (!payload.success || typeof rawHtml !== "string") {
    throw new Error(`Firecrawl returned no rawHtml for ${url}`);
  }

  if (typeof upstreamStatus === "number" && upstreamStatus >= 400) {
    throw new Error(
      `Firecrawl reached ${url} but the upstream returned ${upstreamStatus}`,
    );
  }

  return JSON.parse(rawHtml);
};

export const fetchJsonThroughWaf = async (url: string): Promise<unknown> => {
  try {
    const response = await fetch(url);

    if (
      response.ok &&
      response.headers.get("cf-mitigated") !== "challenge" &&
      isJsonContentType(response.headers.get("content-type"))
    ) {
      return await response.json();
    }

    console.warn(
      `Direct fetch of ${url} was blocked or non-JSON; using Firecrawl`,
    );
  } catch (error) {
    console.warn(`Direct fetch of ${url} threw; using Firecrawl:`, error);
  }

  return fetchViaFirecrawl(url);
};
