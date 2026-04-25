import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveHeader } from "@/components/regatta/results/live-header";
import { ClubPage } from "@/components/regatta/results/pages/club-page";
import { DivisionPage } from "@/components/regatta/results/pages/division-page";
import { IndexPage } from "@/components/regatta/results/pages/index-page";
import { SafeHtml } from "@/components/regatta/results/safe-html";
import {
  decodeHtml,
  detectShape,
  fetchRegattaFile,
  parseClub,
  parseDivision,
  parseIndex,
  type Shape,
  transformRegattaHtml,
} from "@/lib/regatta/results";
import styles from "../regatta.module.css";

type Params = { path?: string[] };

export const revalidate = 60;
export const dynamicParams = true;

function resolveRelative(path?: string[]): string {
  return !path || path.length === 0 ? "index.html" : path.join("/");
}

type LoadedDocument = {
  relative: string;
  shape: Shape;
  html: string;
};

async function loadDocument(path?: string[]): Promise<LoadedDocument> {
  const relative = resolveRelative(path);
  const result = await fetchRegattaFile(relative);

  if (result.status === "not-found") notFound();
  if (result.status === "error") {
    throw new Error(
      `regatta upstream returned ${result.upstreamStatus} for ${relative}`,
    );
  }

  return {
    relative,
    html: decodeHtml(result.bytes),
    shape: detectShape(relative),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { path } = await params;

  try {
    const { html } = await loadDocument(path);
    const { title } = transformRegattaHtml(html);

    return {
      robots: { follow: false, index: false },
      title: `${title} – Live`,
    };
  } catch {
    return {
      robots: { follow: false, index: false },
      title: "Live",
    };
  }
}

/**
 * Render the generic fallback – transform-and-display the upstream HTML
 * inside the site shell with the scoped module CSS. This is the resilient
 * floor every structured renderer falls back to on failure.
 */
function renderFallback(html: string) {
  const { title, body } = transformRegattaHtml(html);

  return (
    <>
      <LiveHeader title={title} />
      <SafeHtml className={styles.wrapper} html={body} />
    </>
  );
}

export default async function LivePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { path } = await params;
  const { relative, shape, html } = await loadDocument(path);

  // Structured renderers land here in phases 2–5. Each wrapped in try/catch
  // so parser failure degrades to the generic fallback instead of 500ing.
  try {
    if (shape === "club") {
      const data = parseClub(html, relative);

      return (
        <>
          <LiveHeader title={data.name || data.code} />
          <ClubPage data={data} />
        </>
      );
    }
    if (shape === "division") {
      const data = parseDivision(html);

      return (
        <>
          <LiveHeader title={data.name} />
          <DivisionPage data={data} />
        </>
      );
    }
    if (shape === "index") {
      const data = parseIndex(html);

      return (
        <>
          <LiveHeader title={data.title} />
          <IndexPage data={data} />
        </>
      );
    }
  } catch (err) {
    console.warn("regatta: structured render failed, falling back", {
      relative,
      err,
    });
  }

  return renderFallback(html);
}
