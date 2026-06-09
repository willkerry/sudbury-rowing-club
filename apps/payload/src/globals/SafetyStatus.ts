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
      admin: {
        description:
          "Conditions traffic light: green = all good, amber = caution, red = no rowing.",
      },
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
      admin: {
        description:
          "Short reason for the current status (e.g. 'high stream, no novices').",
      },
    },
    {
      label: "Show on site",
      name: "display",
      type: "checkbox",
      admin: {
        description: "Untick to suppress the status banner entirely.",
      },
    },
  ],
};
