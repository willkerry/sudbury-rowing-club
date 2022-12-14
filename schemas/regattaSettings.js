import { CogIcon } from "@sanity/icons";

export default {
  name: "regattaSettings",
  type: "document",
  title: "Regatta Settings",
  icon: CogIcon,
  fields: [
    {
      name: "title",
      type: "string",
      required: true,
      description: "Name of the next regatta",
    },
    { name: "date", type: "date", description: "Date of the next regatta" },
    {
      name: "landingPage",
      title: "Landing Page",
      description: "Content displayed on the main regatta landing page.",
      type: "object",
      options: {
        collapsible: true,
      },
      fields: [
        { name: "tagline", type: "text", rows: 2 },
        { name: "description", type: "richText" },
        {
          name: "heroImage",
          type: "object",
          options: {
            collapsible: true,
          },
          fields: [
            { name: "image", type: "image" },
            { name: "heading", type: "string" },
            { name: "subheading", type: "string" },
          ],
        },
        {
          name: "images",
          type: "array",
          options: {
            layout: "grid",
          },
          of: [
            {
              name: "image",
              type: "image",

              fields: [
                {
                  name: "caption",
                  type: "string",
                  title: "Caption",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "note",
      type: "object",
      description:
        "A optional note, displayed near the top of the regatta landing page.",
      fields: [
        { name: "display", type: "boolean" },
        {
          name: "text",
          type: "array",
          of: [{ type: "block" }],
        },
        {
          name: "type",
          type: "string",
          initialValue: "primary",
          options: {
            list: ["primary", "secondary", "success", "warning", "error"],
          },
        },
      ],
      options: {
        collapsible: true,
      },
    },

    {
      name: "events",
      type: "object",
      description: "Race lengths at the regatta",
      fields: [
        {
          name: "events",
          type: "array",
          of: [
            {
              type: "object",
              options: {
                columns: 2,
              },
              fields: [
                { name: "title", type: "string" },
                {
                  name: "course",
                  type: "string",
                  options: {
                    list: ["350m", "650m"],
                    layout: "radio",
                    direction: "horizontal",
                  },
                },
                { name: "description", type: "text", rows: 2 },
                { name: "categories", type: "text", rows: 2 },
                { name: "gender", type: "string" },
                {
                  name: "boatClasses",
                  type: "array",
                  of: [{ type: "string" }],
                  options: {
                    list: [
                      { value: "8+", title: "8+" },
                      { value: "4+", title: "4+" },
                      { value: "4×−", title: "4×−" },
                      { value: "4×+", title: "4×+" },
                      { value: "2+", title: "2+" },
                      { value: "2−", title: "2−" },
                      { value: "2×", title: "2×" },
                      { value: "1×", title: "1×" },
                    ],
                    layout: "grid",
                  },
                },
                { name: "prizes", type: "string" },
              ],
            },
          ],
        },
      ],
      options: {
        collapsible: true,
      },
    },

    {
      name: "entries",
      type: "object",
      description: "Provide entry instructions",
      fields: [
        { name: "description", type: "richText" },
        { name: "waves", title: "Wave matrix", type: "table" },
        {
          name: "wavesCaption",
          title: "Wave matrix caption",
          type: "text",
          rows: 3,
        },
        {
          name: "waveNames",
          type: "array",
          title: "Wave names",
          of: [{ type: "string" }],
          description: "List of wave names",
          options: { layout: "tags" },
        },
      ],
      options: {
        collapsible: true,
      },
    },
    {
      name: "results",
      type: "object",
      description: "Control how regatta results are displayed.",
      fields: [
        { name: "description", type: "richText" },
        { name: "courseRecords", type: "file" },
      ],
      options: {
        collapsible: true,
      },
    },
    {
      name: "competitorInformation",
      type: "object",
      description: "Documents and information",
      fields: [
        { name: "description", type: "text", rows: 4 },
        {
          name: "documents",
          type: "array",
          of: [
            {
              type: "file",
              name: "file",
              fields: [{ name: "title", type: "string" }],
            },
          ],
        },
      ],
      options: {
        collapsible: true,
      },
    },
    {
      name: "courseMap",
      type: "object",
      fields: [
        { name: "heading", type: "string" },
        { name: "description", type: "text", rows: 4 },
        { name: "map", type: "file" },
        { name: "mapImage", title: "Map Image", type: "image" },
      ],
      options: {
        collapsible: true,
      },
    },
  ],
};
