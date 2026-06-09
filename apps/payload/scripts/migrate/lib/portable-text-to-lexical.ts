export interface PortableTextSpan {
  _type: "span";
  marks: string[];
  text: string;
}

export interface PortableTextMarkDef {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

export interface PortableTextBlock {
  _type: "block";
  children: PortableTextSpan[];
  level?: number;
  listItem?: "bullet" | "number";
  markDefs: PortableTextMarkDef[];
  style?: string;
}

export type PortableTextNode =
  | PortableTextBlock
  | { _type: string; [key: string]: unknown };

export interface ConvertContext {
  /** Resolve a Sanity asset reference to a Payload Media id (for upload nodes). */
  resolveUpload: (ref: string) => Promise<string | undefined>;
}

interface LexicalText {
  detail: number;
  format: number;
  mode: "normal";
  style: "";
  text: string;
  type: "text";
  version: 1;
}

interface LexicalLink {
  children: LexicalText[];
  direction: "ltr";
  fields: { linkType: "custom"; newTab: boolean; url: string };
  format: "";
  indent: 0;
  type: "link";
  version: 2;
}

type LexicalInline = LexicalText | LexicalLink;

interface LexicalParagraph {
  children: LexicalInline[];
  direction: "ltr";
  format: "";
  indent: 0;
  textFormat: 0;
  type: "paragraph";
  version: 1;
}

interface LexicalHeading {
  children: LexicalInline[];
  direction: "ltr";
  format: "";
  indent: 0;
  tag: "h2" | "h3" | "h4";
  type: "heading";
  version: 1;
}

interface LexicalListItem {
  children: LexicalInline[];
  direction: "ltr";
  format: "";
  indent: 0;
  type: "listitem";
  value: number;
  version: 1;
}

interface LexicalList {
  children: LexicalListItem[];
  direction: "ltr";
  format: "";
  indent: 0;
  listType: "bullet" | "number";
  start: 1;
  tag: "ul" | "ol";
  type: "list";
  version: 1;
}

type LexicalBlock =
  | LexicalParagraph
  | LexicalHeading
  | LexicalList
  | LexicalCustomBlock
  | LexicalUpload;

interface LexicalCustomBlock {
  fields: Record<string, unknown> & { blockType: string };
  format: "";
  type: "block";
  version: 2;
}

interface LexicalUpload {
  fields: null;
  format: "";
  relationTo: "media";
  type: "upload";
  value: string;
  version: 3;
}

export interface LexicalRoot {
  root: {
    type: "root";
    children: LexicalBlock[];
    format: "";
    indent: 0;
    version: 1;
    direction: "ltr";
  };
}

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;

function text(value: string, format = 0): LexicalText {
  return {
    text: value,
    type: "text",
    format,
    detail: 0,
    mode: "normal",
    style: "",
    version: 1,
  };
}

function emptyParagraph(): LexicalParagraph {
  return {
    children: [text("")],
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    type: "paragraph",
    version: 1,
  };
}

function markFormat(marks: string[]): number {
  let f = 0;
  if (marks.includes("strong")) f |= FORMAT_BOLD;
  if (marks.includes("em")) f |= FORMAT_ITALIC;

  return f;
}

function spansToInline(block: PortableTextBlock): LexicalInline[] {
  const out: LexicalInline[] = [];
  for (const span of block.children) {
    const linkMarkKey = span.marks.find((m) =>
      block.markDefs.some((d) => d._key === m && d._type === "link"),
    );
    const inlineFormat = markFormat(span.marks);
    const node = text(span.text, inlineFormat);
    if (linkMarkKey) {
      const def = block.markDefs.find((d) => d._key === linkMarkKey) as
        | { href?: string }
        | undefined;
      out.push({
        children: [node],
        direction: "ltr",
        fields: { linkType: "custom", newTab: false, url: def?.href ?? "" },
        format: "",
        indent: 0,
        type: "link",
        version: 2,
      });
    } else {
      out.push(node);
    }
  }

  return out;
}

function blockToTopLevel(
  block: PortableTextBlock,
): LexicalParagraph | LexicalHeading {
  const children = spansToInline(block);
  if (block.style === "h2" || block.style === "h3" || block.style === "h4") {
    return {
      tag: block.style,
      type: "heading",
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    };
  }

  return {
    type: "paragraph",
    children,
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    version: 1,
  };
}

function buildList(
  blocks: PortableTextBlock[],
  kind: "bullet" | "number",
): LexicalList {
  return {
    children: blocks.map((b, i) => ({
      children: spansToInline(b),
      direction: "ltr",
      format: "",
      indent: 0,
      type: "listitem",
      value: i + 1,
      version: 1,
    })),
    direction: "ltr",
    format: "",
    indent: 0,
    listType: kind,
    start: 1,
    tag: kind === "bullet" ? "ul" : "ol",
    type: "list",
    version: 1,
  };
}

function collectListItems(
  nodes: PortableTextNode[],
  startIdx: number,
  kind: "bullet" | "number",
): { blocks: PortableTextBlock[]; nextIdx: number } {
  const blocks: PortableTextBlock[] = [];
  let i = startIdx;

  while (i < nodes.length) {
    const next = nodes[i];
    if (next._type !== "block") break;
    const nb = next as PortableTextBlock;
    if (nb.listItem !== kind) break;
    blocks.push(nb);
    i++;
  }

  return { blocks, nextIdx: i };
}

function processNodes(nodes: PortableTextNode[]): LexicalBlock[] {
  const out: LexicalBlock[] = [];
  let i = 0;

  while (i < nodes.length) {
    const n = nodes[i];

    if (n._type !== "block") {
      console.warn(`[pt2lex] unknown node type ${n._type} — skipped`);
      i++;
      continue;
    }

    const block = n as PortableTextBlock;

    if (block.listItem === "bullet" || block.listItem === "number") {
      const { blocks, nextIdx } = collectListItems(nodes, i, block.listItem);
      out.push(buildList(blocks, block.listItem));
      i = nextIdx;
      continue;
    }

    out.push(blockToTopLevel(block));
    i++;
  }

  return out;
}

export async function portableTextToLexical(
  nodes: PortableTextNode[] | undefined | null,
  _ctx: ConvertContext,
): Promise<LexicalRoot> {
  // _ctx used by figure/custom-block branches added in later tasks
  await Promise.resolve();
  if (!nodes || nodes.length === 0) {
    return {
      root: {
        children: [emptyParagraph()],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    };
  }

  const out = processNodes(nodes);

  if (out.length === 0) out.push(emptyParagraph());

  return {
    root: {
      children: out,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}
