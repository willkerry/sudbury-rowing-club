import type { GlobalConfig } from "payload";

export const SiteNotice: GlobalConfig = {
  label: "Site notice",
  slug: "siteNotice",

  versions: true,

  fields: [
    {
      defaultValue: false,
      name: "display",
      type: "checkbox",
      admin: {
        description: "Untick to hide the notice site-wide.",
      },
    },
    {
      defaultValue: "primary",
      name: "variant",
      type: "select",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
      ],
    },
    {
      name: "label",
      type: "text",
      admin: {
        description: "Displayed in bold.",
      },
    },
    {
      name: "body",
      type: "richText",
    },
    {
      label: "Link URL",
      name: "link",
      type: "text",
      admin: {
        description:
          "Optional URL the notice should link to. When set, the whole banner becomes a link and any body text is ignored.",
      },
    },
    {
      name: "date",
      type: "date",
      admin: {
        description: "Acts as a 'last updated' date.",
        position: "sidebar",
      },
    },
    {
      defaultValue: false,
      name: "includeTime",
      type: "checkbox",
      admin: {
        description: "If on, the time is shown alongside the date.",
        position: "sidebar",
      },
    },
  ],
};
