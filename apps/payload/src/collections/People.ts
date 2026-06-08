import type { CollectionConfig } from "payload";

export const People: CollectionConfig = {
  slug: "people",

  access: {
    read: () => true,
  },

  admin: {
    useAsTitle: "fullName",
  },
  fields: [
    {
      name: "firstName",
      required: true,
      type: "text",
    },
    {
      name: "lastName",
      required: true,
      type: "text",
    },

    {
      name: "fullName",
      type: "text",
      admin: {
        hidden: true,
      },
    },

    {
      name: "email",
      type: "email",
      access: {
        // only if the secret is provided in the request or the user is authenticated
        create: ({ req: { headers, user } }) =>
          headers.get("x-secret") === process.env.PAYLOAD_SECRET ||
          Boolean(user),
        read: ({ req: { headers, user } }) =>
          headers.get("x-secret") === process.env.PAYLOAD_SECRET ||
          Boolean(user),
        update: ({ req: { headers, user } }) =>
          headers.get("x-secret") === process.env.PAYLOAD_SECRET ||
          Boolean(user),
      },
    },

    {
      defaultValue: false,
      name: "hasEmail",
      type: "checkbox",
      admin: {
        hidden: true,
      },
    },

    {
      name: "image",
      relationTo: "media",
      type: "upload",
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
        hasEmail: Boolean(data.email),
      }),
    ],
  },

  labels: {
    plural: "People",
    singular: "Person",
  },
};
