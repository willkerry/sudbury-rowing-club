import { defineCollection, defineConfig } from "@content-collections/core";
import { transformMDX as fumaTransformMDX } from "@fumadocs/content-collections/configuration";
import { remarkAdmonition } from "fumadocs-core/mdx-plugins";
import remarkSmartypants from "remark-smartypants";
import { z } from "zod";

// Only metadata and the table of contents are kept: the page renders each
// policy from its build-time-compiled .mdx module (lib/policy-content.ts), so
// the raw source, compiled body and search data would only add dead weight to
// the Worker bundle.
const transform = async <
  TDocument extends Parameters<typeof fumaTransformMDX>[0],
>(
  document: TDocument,
  context: Parameters<typeof fumaTransformMDX>[1],
) => {
  const {
    body: _body,
    content: _content,
    structuredData: _structuredData,
    ...policy
  } = await fumaTransformMDX(document, context, {
    rehypeCodeOptions: false,
    remarkPlugins: [remarkAdmonition, remarkSmartypants],
  });

  return policy;
};

const StatusSchema = z.union([z.literal("draft"), z.literal("published")]);

const PrePostNoteSchema = z.union([
  z.object({
    label: z.string(),
    url: z.string().optional(),
    value: z.string(),
  }),
  z.string(),
]);

const policies = defineCollection({
  directory: "content/policies",
  include: "**/*.mdx",
  name: "policies",
  schema: z.object({
    content: z.string(),
    description: z.string().optional(),
    postnotes: z.array(PrePostNoteSchema).optional(),
    prenotes: z.array(PrePostNoteSchema).optional(),
    status: StatusSchema.optional().default("published"),
    title: z.string(),
  }),
  transform,
});

const squads = defineCollection({
  directory: "content/squads",
  include: "**/*.mdx",
  name: "squads",
  schema: z.object({
    description: z.string().optional(),
    keyword: z.string().optional(),
    title: z.string(),
  }),
  transform,
});

export default defineConfig({
  content: [policies, squads],
});
