import type { GlobalConfig } from "payload";

export const SafetyStatus: GlobalConfig = {
  label: "Status",
  slug: "safetyStatus",

  admin: {
    group: "Safety",
  },

  fields: [
    {
      name: "status",
      type: "radio",
      options: [
        { label: "Neutral", value: "neutral" },
        { label: "Green", value: "green" },
        { label: "Amber", value: "amber" },
        { label: "Red", value: "red" },
      ],
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "display",
      type: "checkbox",
    },
  ],
};
