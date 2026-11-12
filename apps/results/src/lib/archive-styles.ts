import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import browserslist from "browserslist";
import {
  browserslistToTargets,
  type Selector,
  type SelectorComponent,
  transform,
} from "lightningcss";
import { APP_DIR, DATA_DIR } from "./paths.ts";

export const ARCHIVE_STYLE_FILE = "GeneralStyle.css";
export const ARCHIVE_STYLE_ATTRIBUTE = "data-archive";
export const ARCHIVE_STYLE_DIR = "_archive";

const ROOT_ELEMENTS = new Set(["html", "body"]);

const targets = browserslistToTargets(
  browserslist(undefined, { path: APP_DIR }),
);

const scopeComponent = (hash: string): SelectorComponent => ({
  type: "attribute",
  name: ARCHIVE_STYLE_ATTRIBUTE,
  operation: { operator: "equal", value: hash },
});

const splitCompounds = (selector: Selector) => {
  const compounds: SelectorComponent[][] = [[]];
  const combinators: SelectorComponent[] = [];

  for (const component of selector) {
    if (component.type === "combinator") {
      combinators.push(component);
      compounds.push([]);
    } else {
      compounds.at(-1)?.push(component);
    }
  }

  return { combinators, compounds };
};

const isRootElement = (component: SelectorComponent) =>
  component.type === "type" && ROOT_ELEMENTS.has(component.name.toLowerCase());

/**
 * Prefix a selector with the year's scope. Leading `html`/`body` compounds
 * collapse into the scope element itself, so page-level rules style the
 * archive wrapper rather than the site around it.
 */
const scopeSelector = (selector: Selector, hash: string): Selector => {
  const { combinators, compounds } = splitCompounds(selector);
  const firstInner = compounds.findIndex(
    (compound) => !compound.some(isRootElement),
  );
  const leading = firstInner === -1 ? compounds.length : firstInner;
  const scope = [
    scopeComponent(hash),
    ...compounds
      .slice(0, leading)
      .flat()
      .filter((component) => !isRootElement(component)),
  ];

  const rest = compounds.slice(leading).flatMap((compound, index) => {
    const combinator = combinators[leading + index - 1];

    return index === 0
      ? compound
      : [combinator as SelectorComponent, ...compound];
  });

  const lowercased = rest.map((component) =>
    component.type === "type"
      ? { ...component, name: component.name.toLowerCase() }
      : component,
  );

  const join: SelectorComponent = combinators[leading - 1] ?? {
    type: "combinator",
    value: "descendant",
  };

  return lowercased.length === 0 ? scope : [...scope, join, ...lowercased];
};

export const hashStylesheet = (source: Buffer) =>
  createHash("sha256").update(source).digest("hex").slice(0, 10);

export const scopeStylesheet = (source: Buffer, hash: string) =>
  transform({
    code: Buffer.concat([
      Buffer.from("@layer archive {\n"),
      source,
      Buffer.from("\n}"),
    ]),
    filename: `${hash}.css`,
    minify: true,
    targets,
    visitor: { Selector: (selector) => scopeSelector(selector, hash) },
  }).code;

export const readArchiveStyle = async (folder: string) => {
  try {
    const source = await readFile(
      path.join(DATA_DIR, folder, ARCHIVE_STYLE_FILE),
    );

    return { hash: hashStylesheet(source), source };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;

    throw error;
  }
};

export const archiveStyleUrl = (hash: string) =>
  `/${ARCHIVE_STYLE_DIR}/${hash}.css`;
