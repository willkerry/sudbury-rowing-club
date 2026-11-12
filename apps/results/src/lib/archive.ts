import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { buildCloudflareImageUrl } from "@sudburyrc/images";
import { clubs } from "@sudburyrc/static";
import { type DefaultTreeAdapterTypes, parse, serialize } from "parse5";
import { readArchiveStyle } from "./archive-styles.ts";
import { DATA_DIR } from "./paths.ts";

const HTML_EXTENSION_REGEX = /\.html?$/i;
const YEAR_REGEX = /(\d{4})/;

export type PageKind = "index" | "event" | "club" | "division" | "page";

export interface ArchivePage {
  id: string;
  folder: string;
  file: string;
  year: number | null;
  kind: PageKind;
  label: string;
  /** Only the regatta's own title: placeholders the results software wrote for events with no entries. */
  empty: boolean;
  style: string | null;
  html: string;
}

export const isHtmlFile = (file: string) => HTML_EXTENSION_REGEX.test(file);

const HTML_SUFFIX = ".html";

/** The filename as published, minus the `.html` every page URL already implies. */
const displayName = (file: string) =>
  file.endsWith(HTML_SUFFIX) ? file.slice(0, -HTML_SUFFIX.length) : file;

/** Astro adds `.html` back to every page; other extensions (`.htm`, `.HTM`) stay in the id. */
export const toPageId = (folder: string, file: string) =>
  `${folder}/${displayName(file)}`;

export const yearOf = (folder: string) => {
  const match = folder.match(YEAR_REGEX);

  return match ? Number(match[1]) : null;
};

export const listFolders = async () => {
  const entries = await readdir(DATA_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
};

export const listFiles = async (folder: string) => {
  const entries = await readdir(path.join(DATA_DIR, folder), {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();
};

const KIND_PREFIXES: [string, PageKind][] = [
  ["event_", "event"],
  ["club_", "club"],
  ["division_", "division"],
];

const classify = (file: string): { kind: PageKind; label: string } => {
  const name = displayName(file);
  const lower = name.toLowerCase();

  if (lower.replace(HTML_EXTENSION_REGEX, "") === "index") {
    return { kind: "index", label: file === "index.html" ? "Index" : name };
  }

  for (const [prefix, kind] of KIND_PREFIXES) {
    if (lower.startsWith(prefix)) {
      const rest = name.slice(prefix.length);

      return {
        kind,
        label: kind === "division" ? `Division ${rest}` : rest,
      };
    }
  }

  return { kind: "page", label: name };
};

const HEADED_KINDS = new Set<PageKind>(["event", "club"]);
const MAX_HEADING_LENGTH = 80;

// The source files are latin-1, but some contain UTF-8 replacement characters
// that decode to "ï¿½"; dropping "ï¿" leaves the "½" the results meant.
const BROKEN_FRACTION_REGEX = /ï¿/g;

type ParentNode = { childNodes: DefaultTreeAdapterTypes.ChildNode[] };

const childElement = (parent: ParentNode | undefined, name: string) =>
  parent?.childNodes.find(
    (node): node is DefaultTreeAdapterTypes.Element => node.nodeName === name,
  );

function* textsOf(node: ParentNode): Generator<string> {
  for (const child of node.childNodes) {
    if (child.nodeName === "#text" && "value" in child) {
      yield child.value.replaceAll("\u00a0", " ").trim();
    } else if ("childNodes" in child) {
      yield* textsOf(child);
    }
  }
}

/** The first line of text after the regatta's own title, e.g. "Bedford Rowing Club". */
const headingOf = (body: ParentNode) =>
  textsOf(body).find(
    (text) =>
      text.length > 0 &&
      text.length <= MAX_HEADING_LENGTH &&
      !text.startsWith("Sudbury Regatta"),
  );

type Link = { href: string; text: string };

const WHITESPACE_REGEX = /\s+/g;

function* linksOf(node: ParentNode): Generator<Link> {
  for (const child of node.childNodes) {
    if (!("childNodes" in child)) continue;

    const href =
      child.nodeName === "a"
        ? child.attrs.find((attr) => attr.name === "href")?.value
        : undefined;

    if (href) {
      const text = [...textsOf(child)].join(" ").replace(WHITESPACE_REGEX, " ");

      yield { href: href.trim(), text: text.trim() };
    } else {
      yield* linksOf(child);
    }
  }
}

const isTitleOnly = (body: ParentNode) =>
  textsOf(body).every(
    (text) => text.length === 0 || text.startsWith("Sudbury"),
  );

/** Parse as a browser would, so the body markup matches what the old pages rendered. */
const parseBody = (source: string) => {
  const body = childElement(childElement(parse(source), "html"), "body");

  return body
    ? {
        html: serialize(body),
        heading: headingOf(body),
        empty: isTitleOnly(body),
        links: [...linksOf(body)],
      }
    : { html: "", heading: undefined, links: [], empty: true };
};

const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]/g;

const spelling = (text: string) =>
  text.toLowerCase().replace(NON_ALPHANUMERIC_REGEX, "");

/**
 * Filenames lose the case and punctuation of what they name (`w.eli.8_` is
 * "W.ELI.8+"). Where every link to a page that spells out its filename agrees
 * on one text, that text is the archive's own name for it.
 */
const namesFromLinks = (pages: { file: string; links: Link[] }[]) => {
  const filesByLowerName = new Map(
    pages.map(({ file }) => [file.toLowerCase(), file]),
  );
  const candidates = new Map<string, Set<string>>();

  for (const { links } of pages) {
    for (const { href, text } of links) {
      const file = filesByLowerName.get(href.toLowerCase());
      const stem = file?.replace(HTML_EXTENSION_REGEX, "");

      if (!(file && stem) || spelling(text) !== spelling(stem)) continue;

      candidates.set(file, (candidates.get(file) ?? new Set()).add(text));
    }
  }

  return new Map(
    [...candidates]
      .filter(([, texts]) => texts.size === 1)
      .map(([file, texts]) => [file, [...texts][0] as string]),
  );
};

const bladeUrlMap = new Map(
  clubs
    .filter((club) => club.bladeUrl && club.newBladeUrl)
    .map((club) => [club.bladeUrl, club.newBladeUrl]),
);

const boatCodeToBladeUrlMap = new Map(
  clubs
    .filter((club) => club.code && club.newBladeUrl)
    .map((club) => [club.code.toLowerCase(), club.newBladeUrl]),
);

const CLUBIMAGES_SRC_REGEX =
  /src="(https:\/\/clubimages\.britishrowing\.org\/blades\?id=\d+)"/g;
const WORDPRESS_SRC_REGEX =
  /src="http:\/\/www\.britishrowing\.org\/sites\/all\/themes\/britishrowing\/images\/blades\/([a-z]+)\.gif"/gi;

// British Rowing's blade PNGs are 150×70, the size the archive's <img> tags display them at.
const bladeSrc = (url: string) =>
  `src="${buildCloudflareImageUrl(url, { fit: "contain", format: "auto", height: 70, width: 150 })}"`;

const replaceBladeUrls = (html: string) =>
  html
    .replaceAll(CLUBIMAGES_SRC_REGEX, (match, oldUrl: string) => {
      const url = bladeUrlMap.get(oldUrl);

      return url ? bladeSrc(url) : match;
    })
    .replaceAll(WORDPRESS_SRC_REGEX, (match, code: string) => {
      const url = boatCodeToBladeUrlMap.get(code.toLowerCase());

      return url ? bladeSrc(url) : match;
    });

const decode = (source: Buffer) =>
  source.toString("latin1").replace(BROKEN_FRACTION_REGEX, "");

export const readFolder = async (folder: string) => {
  const files = (await listFiles(folder)).filter(isHtmlFile);
  const style = await readArchiveStyle(folder);
  const year = yearOf(folder);

  const parsed = await Promise.all(
    files.map(async (file) => {
      const source = decode(await readFile(path.join(DATA_DIR, folder, file)));

      return { file, ...parseBody(source) };
    }),
  );
  const linkedNames = namesFromLinks(parsed);

  const pages = parsed.map(({ file, html, heading, empty }): ArchivePage => {
    const { kind, label } = classify(file);

    return {
      id: toPageId(folder, file),
      folder,
      file,
      year,
      kind,
      label:
        (HEADED_KINDS.has(kind) && heading) || linkedNames.get(file) || label,
      empty,
      style: style?.hash ?? null,
      html: replaceBladeUrls(html),
    };
  });

  const labelCounts = Map.groupBy(pages, (page) => page.label);

  return pages.map((page) =>
    (labelCounts.get(page.label)?.length ?? 0) > 1
      ? { ...page, label: `${page.label} (${page.file})` }
      : page,
  );
};
