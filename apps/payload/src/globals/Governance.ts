import type { GlobalConfig } from "payload";

export const Governance: GlobalConfig = {
  slug: "governance",

  fields: [
    {
      admin: { appearance: "drawer" },
      hasMany: true,
      name: "trustees",
      relationTo: "people",
      type: "relationship",
    },
  ],
};
