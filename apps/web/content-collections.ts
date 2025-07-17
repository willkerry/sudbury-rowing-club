import { defineCollection, defineConfig } from "@content-collections/core";
import { transformMDX as fumaTransformMDX } from "@fumadocs/content-collections/configuration";
import { remarkAdmonition } from "fumadocs-core/mdx-plugins";
import remarkSmartypants from "remark-smartypants";
import { z } from "zod";

const transform: typeof fumaTransformMDX = (document, context) =>
  fumaTransformMDX(document, context, {
    remarkPlugins: [remarkAdmonition, remarkSmartypants],
    rehypeCodeOptions: {
      themes: {
        light: "github-dark",
        dark: "github-dark",
      },
    },
  });

const StatusSchema = z.union([z.literal("draft"), z.literal("published")]);

const PrePostNoteSchema = z.union([
  z.object({
    label: z.string(),
    value: z.string(),
    url: z.string().optional(),
  }),
  z.string(),
]);

const policies = defineCollection({
  name: "policies",
  directory: "content/policies",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    status: StatusSchema.optional().default("published"),
    description: z.string().optional(),
    prenotes: z.array(PrePostNoteSchema).optional(),
    postnotes: z.array(PrePostNoteSchema).optional(),
  }),
  transform,
});

export default defineConfig({
  collections: [policies],
});
