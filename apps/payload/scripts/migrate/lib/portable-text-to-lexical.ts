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

async function convertQuote(
  node: PortableTextNode,
  ctx: ConvertContext,
): Promise<LexicalBlock> {
  const q = node as { body?: PortableTextNode[]; attribution?: string };
  const inner = await portableTextToLexical(q.body ?? [], ctx);

  return {
    format: "",
    type: "block",
    version: 2,
    fields: {
      attribution: q.attribution ?? "",
      blockType: "quote",
      body: inner,
    },
  };
}

async function convertNote(
  node: PortableTextNode,
  ctx: ConvertContext,
): Promise<LexicalBlock> {
  const nt = node as { type?: string; body?: PortableTextNode[] };
  const inner = await portableTextToLexical(nt.body ?? [], ctx);
  const variant =
    (nt.type as "primary" | "success" | "warning" | "error") ?? "primary";

  return {
    fields: { blockType: "note", variant, body: inner },
    format: "",
    type: "block",
    version: 2,
  };
}

function convertOembed(node: PortableTextNode): LexicalBlock {
  const oe = node as { url?: string };

  return {
    fields: { blockType: "oembed", url: oe.url ?? "" },
    format: "",
    type: "block",
    version: 2,
  };
}

async function convertFigure(
  node: PortableTextNode,
  ctx: ConvertContext,
): Promise<LexicalBlock> {
  const fig = node as { image?: { asset?: { _ref?: string } } };
  const ref = fig.image?.asset?._ref;
  const mediaId = ref ? await ctx.resolveUpload(ref) : undefined;
  if (mediaId) {
    return {
      fields: null,
      format: "",
      relationTo: "media",
      type: "upload",
      value: mediaId,
      version: 3,
    };
  }

  console.warn(
    `[pt2lex] figure with unresolved ref ${ref ?? "(none)"} — skipped`,
  );

  return emptyParagraph();
}

async function processNodes(
  nodes: PortableTextNode[],
  ctx: ConvertContext,
): Promise<LexicalBlock[]> {
  const out: LexicalBlock[] = [];
  let i = 0;

  while (i < nodes.length) {
    const n = nodes[i];

    if (n._type === "block") {
      const block = n as PortableTextBlock;
      if (block.listItem === "bullet" || block.listItem === "number") {
        const { blocks, nextIdx } = collectListItems(nodes, i, block.listItem);
        out.push(buildList(blocks, block.listItem));
        i = nextIdx;
        continue;
      }
      out.push(blockToTopLevel(block));
      i++;
      continue;
    }

    if (n._type === "figure") {
      out.push(await convertFigure(n, ctx));
      i++;
      continue;
    }

    if (n._type === "quote") {
      out.push(await convertQuote(n, ctx));
      i++;
      continue;
    }

    if (n._type === "note") {
      out.push(await convertNote(n, ctx));
      i++;
      continue;
    }

    if (n._type === "oembed") {
      out.push(convertOembed(n));
      i++;
      continue;
    }

    console.warn(`[pt2lex] unknown node type ${n._type} — skipped`);
    i++;
  }

  return out;
}

export async function portableTextToLexical(
  nodes: PortableTextNode[] | undefined | null,
  ctx: ConvertContext,
): Promise<LexicalRoot> {
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

  const out = await processNodes(nodes, ctx);

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
