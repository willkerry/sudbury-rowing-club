import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  auth: true,
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};
