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
        dark: "github-dark",
        light: "github-dark",
      },
    },
  });

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
    description: z.string().optional(),
    postnotes: z.array(PrePostNoteSchema).optional(),
    prenotes: z.array(PrePostNoteSchema).optional(),
    status: StatusSchema.optional().default("published"),
    title: z.string(),
  }),
  transform,
});

export default defineConfig({
  collections: [policies],
});
