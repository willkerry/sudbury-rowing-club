import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  label: "Site settings",
  slug: "siteSettings",

  versions: true,

  fields: [
    {
      label: "Club identity",
      name: "club",
      type: "group",
      fields: [
        {
          defaultValue: "Sudbury Rowing Club",
          name: "name",
          type: "text",
        },
        {
          name: "email",
          type: "email",
          admin: {
            description: "Primary contact email shown publicly.",
          },
        },
        {
          name: "logo",
          relationTo: "media",
          type: "upload",
        },
        {
          name: "foundingDate",
          type: "date",
          admin: {
            description: "Used in schema.org markup.",
            date: {
              displayFormat: "yyyy",
              pickerAppearance: "monthOnly",
            },
          },
        },
      ],
    },
    {
      name: "address",
      type: "group",
      fields: [
        { name: "streetAddress", type: "text" },
        { defaultValue: "Sudbury", name: "locality", type: "text" },
        { defaultValue: "Suffolk", name: "region", type: "text" },
        { name: "postalCode", type: "text" },
        { defaultValue: "United Kingdom", name: "country", type: "text" },
        {
          name: "mapUrl",
          type: "text",
          admin: {
            description:
              "Canonical link to the club on Google/Apple/etc. Used in schema.org markup as hasMap.",
          },
        },
      ],
    },
    {
      label: "Club coordinates",
      name: "location",
      type: "group",
      admin: {
        description: "Used for embedded maps and schema.org.",
      },
      fields: [
        { name: "lat", type: "number" },
        { name: "lng", type: "number" },
      ],
    },
    {
      label: "Regatta venue coordinates",
      name: "regattaLocation",
      type: "group",
      admin: {
        description: "Where regatta visitors should arrive on the day.",
      },
      fields: [
        { name: "lat", type: "number" },
        { name: "lng", type: "number" },
      ],
    },
    {
      label: "Outbound email sender",
      name: "sender",
      type: "group",
      admin: {
        description: "Used as the From: header on automated emails.",
      },
      fields: [
        {
          defaultValue: "Sudbury Rowing Club",
          name: "name",
          type: "text",
        },
        { name: "email", type: "email" },
      ],
    },
    {
      labels: { plural: "Accounts", singular: "Account" },
      name: "socials",
      type: "array",
      fields: [
        {
          name: "platform",
          required: true,
          type: "select",
          options: [
            { label: "Facebook", value: "facebook" },
            { label: "Instagram", value: "instagram" },
            { label: "X", value: "x" },
            { label: "YouTube", value: "youtube" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "TikTok", value: "tiktok" },
          ],
        },
        {
          name: "handle",
          type: "text",
          admin: {
            description: "Public handle including @, for display only.",
          },
        },
        {
          name: "href",
          required: true,
          type: "text",
        },
      ],
    },
  ],
};
