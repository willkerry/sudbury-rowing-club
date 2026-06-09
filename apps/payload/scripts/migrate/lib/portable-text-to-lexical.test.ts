import { describe, expect, it } from "bun:test";
import type { ConvertContext } from "./portable-text-to-lexical";
import { portableTextToLexical } from "./portable-text-to-lexical";

const stubCtx: ConvertContext = {
  resolveUpload: async (): Promise<string | undefined> => undefined,
};

describe("portableTextToLexical — fallbacks", () => {
  it("warns and emits a paragraph for an unknown block type", async () => {
    const original = console.warn;
    const calls: string[] = [];
    console.warn = (m: string): void => {
      calls.push(m);
    };
    try {
      const out = await portableTextToLexical(
        [{ _type: "mysterious", text: "..." }],
        stubCtx,
      );
      expect((out.root.children[0] as { type: string }).type).toBe("paragraph");
      expect(calls.some((c) => c.includes("mysterious"))).toBe(true);
    } finally {
      console.warn = original;
    }
  });
});

describe("portableTextToLexical — custom blocks", () => {
  it("converts a quote block", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "quote",
          attribution: "A. Person",
          body: [
            {
              _type: "block",
              children: [{ _type: "span", marks: [], text: "Wisdom" }],
              markDefs: [],
              style: "normal",
            },
          ],
        },
      ],
      stubCtx,
    );
    const block = out.root.children[0] as {
      type: string;
      fields: { blockType: string; attribution: string };
    };
    expect(block.type).toBe("block");
    expect(block.fields.blockType).toBe("quote");
    expect(block.fields.attribution).toBe("A. Person");
  });

  it("converts a note block", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "note",
          type: "warning",
          body: [
            {
              _type: "block",
              children: [{ _type: "span", marks: [], text: "Heads up" }],
              markDefs: [],
              style: "normal",
            },
          ],
        },
      ],
      stubCtx,
    );
    const block = out.root.children[0] as {
      fields: { blockType: string; variant: string };
    };
    expect(block.fields.blockType).toBe("note");
    expect(block.fields.variant).toBe("warning");
  });

  it("converts an oembed block", async () => {
    const out = await portableTextToLexical(
      [{ _type: "oembed", url: "https://youtube.com/watch?v=abc" }],
      stubCtx,
    );
    const block = out.root.children[0] as {
      fields: { blockType: string; url: string };
    };
    expect(block.fields.blockType).toBe("oembed");
    expect(block.fields.url).toBe("https://youtube.com/watch?v=abc");
  });
});

describe("portableTextToLexical — figure", () => {
  it("converts a figure block to an upload node using the resolver", async () => {
    const ctx: ConvertContext = {
      resolveUpload: async (ref: string): Promise<string | undefined> =>
        ref === "image-abc-100x100-jpg" ? "media-uuid-1" : undefined,
    };
    const out = await portableTextToLexical(
      [
        {
          _type: "figure",
          altText: "Some alt",
          image: {
            _type: "image",
            asset: { _ref: "image-abc-100x100-jpg", _type: "reference" },
          },
        },
      ],
      ctx,
    );
    const upload = out.root.children[0] as {
      type: string;
      relationTo: string;
      value: string;
    };
    expect(upload.type).toBe("upload");
    expect(upload.relationTo).toBe("media");
    expect(upload.value).toBe("media-uuid-1");
  });

  it("emits a warning paragraph when the figure can't be resolved", async () => {
    const ctx: ConvertContext = {
      resolveUpload: async (): Promise<string | undefined> => undefined,
    };
    const out = await portableTextToLexical(
      [{ _type: "figure", image: { asset: { _ref: "missing" } } }],
      ctx,
    );
    expect((out.root.children[0] as { type: string }).type).toBe("paragraph");
  });
});

describe("portableTextToLexical — text content", () => {
  it("converts a simple paragraph", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "block",
          children: [{ _type: "span", marks: [], text: "Hello" }],
          markDefs: [],
          style: "normal",
        },
      ],
      stubCtx,
    );

    const para = out.root.children[0] as {
      type: string;
      children: { text: string }[];
    };
    expect(para.type).toBe("paragraph");
    expect(para.children[0].text).toBe("Hello");
  });

  it("converts heading styles", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "block",
          children: [{ _type: "span", marks: [], text: "Two" }],
          markDefs: [],
          style: "h2",
        },
        {
          _type: "block",
          children: [{ _type: "span", marks: [], text: "Three" }],
          markDefs: [],
          style: "h3",
        },
        {
          _type: "block",
          children: [{ _type: "span", marks: [], text: "Four" }],
          markDefs: [],
          style: "h4",
        },
      ],
      stubCtx,
    );

    const tags = (out.root.children as { tag: string }[]).map((c) => c.tag);
    expect(tags).toEqual(["h2", "h3", "h4"]);
  });

  it("applies bold and italic via the format bitmask", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "block",
          markDefs: [],
          style: "normal",
          children: [
            { _type: "span", marks: ["strong"], text: "bold" },
            { _type: "span", marks: ["em"], text: " plus italic" },
            { _type: "span", marks: ["strong", "em"], text: " both" },
          ],
        },
      ],
      stubCtx,
    );

    const spans = (out.root.children[0] as { children: { format: number }[] })
      .children;
    // Lexical text format bits: bold=1, italic=2
    expect(spans[0].format).toBe(1);
    expect(spans[1].format).toBe(2);
    expect(spans[2].format).toBe(3);
  });

  it("converts link marks to link nodes", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "block",
          children: [{ _type: "span", marks: ["k1"], text: "click" }],
          style: "normal",
          markDefs: [
            { _key: "k1", _type: "link", href: "https://example.com" },
          ],
        },
      ],
      stubCtx,
    );

    const link = (
      out.root.children[0] as {
        children: { type: string; fields: { url: string } }[];
      }
    ).children[0];
    expect(link.type).toBe("link");
    expect(link.fields.url).toBe("https://example.com");
  });

  it("groups consecutive list items into a list node", async () => {
    const out = await portableTextToLexical(
      [
        {
          _type: "block",
          children: [{ _type: "span", marks: [], text: "one" }],
          level: 1,
          listItem: "bullet",
          markDefs: [],
          style: "normal",
        },
        {
          _type: "block",
          children: [{ _type: "span", marks: [], text: "two" }],
          level: 1,
          listItem: "bullet",
          markDefs: [],
          style: "normal",
        },
        {
          _type: "block",
          children: [{ _type: "span", marks: [], text: "after" }],
          markDefs: [],
          style: "normal",
        },
      ],
      stubCtx,
    );

    expect((out.root.children[0] as { type: string }).type).toBe("list");
    expect(
      (out.root.children[0] as { children: unknown[] }).children,
    ).toHaveLength(2);
    expect((out.root.children[1] as { type: string }).type).toBe("paragraph");
  });
});
