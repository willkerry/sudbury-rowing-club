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
      name: "alt",
      required: true,
      type: "text",
    },
    {
      name: "caption",
      type: "textarea",
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
