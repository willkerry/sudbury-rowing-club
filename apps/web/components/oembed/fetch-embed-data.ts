import { parseHTML } from "linkedom";

type OEmbedData = {
  type?: string;
  width?: number;
  height?: number;
  html?: string;
  title?: string;
  provider_name?: string;
};

type OpenGraphMedia = {
  url?: string;
  width?: number;
  height?: number;
};

export type EmbedData = {
  canonicalUrl?: string;
  title?: string;
  oEmbed?: OEmbedData;
  openGraph: {
    description?: string;
    images: OpenGraphMedia[];
    siteName?: string;
    title?: string;
    type?: string;
    url?: string;
    videos: OpenGraphMedia[];
  };
};

const TIMEOUT_MS = 5000;

const toNumber = (value: string | undefined) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const fetchOEmbed = async (
  href: string,
  baseUrl: string,
): Promise<OEmbedData | undefined> => {
  try {
    const response = await fetch(new URL(href, baseUrl), {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) return;

    return (await response.json()) as OEmbedData;
  } catch {
    return;
  }
};

export const fetchEmbedData = async (url: string): Promise<EmbedData> => {
  const response = await fetch(url, {
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Could not load ${url} (${response.status})`);
  }

  const { document } = parseHTML(await response.text());

  const meta = (property: string) =>
    document
      .querySelector(`meta[property="${property}"], meta[name="${property}"]`)
      ?.getAttribute("content") ?? undefined;

  const metaAll = (property: string) =>
    [...document.querySelectorAll(`meta[property="${property}"]`)].map(
      (element) => element.getAttribute("content") ?? undefined,
    );

  const images = metaAll("og:image").map((imageUrl) => ({ url: imageUrl }));
  const videoUrls = metaAll("og:video:url");
  const videos = (videoUrls.length > 0 ? videoUrls : metaAll("og:video")).map(
    (videoUrl) => ({
      height: toNumber(meta("og:video:height")),
      url: videoUrl,
      width: toNumber(meta("og:video:width")),
    }),
  );

  const oEmbedHref = document
    .querySelector('link[type="application/json+oembed"]')
    ?.getAttribute("href");

  return {
    canonicalUrl:
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
      undefined,
    oEmbed: oEmbedHref ? await fetchOEmbed(oEmbedHref, url) : undefined,
    title: document.querySelector("title")?.textContent?.trim() ?? undefined,
    openGraph: {
      description: meta("og:description"),
      images,
      siteName: meta("og:site_name"),
      title: meta("og:title"),
      type: meta("og:type"),
      url: meta("og:url"),
      videos,
    },
  };
};
