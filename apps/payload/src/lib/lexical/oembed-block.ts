import type { Block } from "payload";

export const OembedBlock: Block = {
  interfaceName: "OembedBlock",
  labels: { plural: "Embeds", singular: "Embed" },
  slug: "oembed",
  fields: [
    {
      name: "url",
      required: true,
      type: "text",
      admin: {
        description: "URL of the embeddable resource (YouTube, Vimeo, etc.)",
      },
    },
  ],
};
