import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  auth: true,
  defaultSort: "email",
  slug: "users",
  admin: {
    defaultColumns: ["email"],
    useAsTitle: "email",
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};
