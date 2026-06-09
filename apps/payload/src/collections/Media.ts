import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  defaultSort: "-updatedAt",
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ["filename", "mimeType", "width", "height"],
    useAsTitle: "filename",
  },
  fields: [
    {
      label: "Alt text",
      name: "alt",
      required: true,
      type: "text",
      admin: {
        description:
          "Describes the image for users who can't see it. Keep it short, factual, and don't repeat the caption.",
      },
    },
    {
      name: "caption",
      type: "textarea",
      admin: {
        description:
          "Optional supporting line shown under the image (subjects' names, location, etc.).",
      },
    },
    {
      index: true,
      name: "sanityAssetId",
      type: "text",
      admin: {
        description:
          "Original Sanity asset id. Migration uses this for idempotency. Safe to clear once Sanity is gone.",
        hidden: true,
      },
    },
  ],
  upload: {
    crop: false,
    focalPoint: false,
  },
};
