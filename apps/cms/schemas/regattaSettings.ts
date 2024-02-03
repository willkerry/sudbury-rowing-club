import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const RegattaSettings = defineType({
  name: "regattaSettings",
  type: "document",
  title: "Regatta Settings",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Name of the next regatta",
    }),
    defineField({
      name: "date",
      type: "date",
      description: "Date of the next regatta",
    }),
    defineField({
      type: "object",
      name: "landingPage",
      title: "Landing Page",
      description: "Content displayed on the main regatta landing page.",

      options: {
        collapsible: true,
      },
      fields: [
        defineField({ name: "tagline", type: "text", rows: 2 }),
        defineField({ name: "description", type: "richText" }),
        defineField({
          name: "heroImage",
          type: "object",
          options: {
            collapsible: true,
          },
          fields: [
            defineField({ name: "image", type: "image" }),
            defineField({ name: "heading", type: "string" }),
            defineField({ name: "subheading", type: "string" }),
          ],
        }),
        defineField({
          name: "images",
          type: "array",
          options: {
            layout: "grid",
          },
          of: [
            defineArrayMember({
              name: "image",
              type: "image",

              fields: [
                defineField({
                  name: "caption",
                  type: "string",
                  title: "Caption",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      type: "object",
      name: "note",
      description:
        "A optional note, displayed near the top of the regatta landing page and homepage.",
      fields: [
        defineField({
          name: "display",
          type: "boolean",
          description: "If set to false, the note will not be displayed.",
        }),
        defineField({
          name: "label",
          type: "string",
          description: "Displayed in bold",
        }),
        defineField({
          name: "link",
          type: "url",
          description:
            "If set, no text will be displayed and the banner will link to this URL (useful, for example, for linking to the draw).",
        }),
        defineField({
          name: "text",
          type: "array",
          of: [defineArrayMember({ type: "block" })],
        }),
        defineField({
          name: "type",
          type: "string",
          initialValue: "primary",
          options: {
            list: ["primary", "secondary", "success", "warning", "error"],
          },
          description:
            "The type of note to display: primary is suitable for most, secondary is bad or sad, success is green, warning is yellow, and error is red.",
        }),
        defineField({
          name: "date",
          type: "date",
          description:
            "If text is set and this date is not blank, it will be displated below the text. Acts as a 'last updated' date.",
        }),
      ],
      options: {
        collapsible: true,
      },
    }),

    defineField({
      type: "object",
      name: "events",
      description: "Race lengths at the regatta",
      fields: [
        defineField({
          name: "events",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              options: {
                columns: 2,
              },
              fields: [
                defineField({ name: "title", type: "string" }),
                defineField({
                  name: "course",
                  type: "string",
                  options: {
                    list: ["350m", "650m"],
                    layout: "radio",
                    direction: "horizontal",
                  },
                }),
                defineField({ name: "description", type: "text", rows: 2 }),
                defineField({ name: "categories", type: "text", rows: 2 }),
                defineField({ name: "gender", type: "string" }),
                defineField({
                  name: "boatClasses",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
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
                }),
                defineField({ name: "prizes", type: "string" }),
              ],
            }),
          ],
        }),
      ],
      options: {
        collapsible: true,
      },
    }),

    defineField({
      type: "object",
      name: "entries",
      description: "Provide entry instructions",
      fields: [
        defineField({ name: "description", type: "richText" }),
        defineField({ name: "waves", title: "Wave matrix", type: "table" }),
        defineField({
          name: "wavesCaption",
          title: "Wave matrix caption",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "waveNames",
          type: "array",
          title: "Wave names",
          of: [defineArrayMember({ type: "string" })],
          description: "List of wave names",
          options: { layout: "tags" },
        }),
      ],
      options: {
        collapsible: true,
      },
    }),
    defineField({
      name: "results",
      type: "object",
      description: "Control how regatta results are displayed.",
      fields: [
        defineField({ name: "description", type: "richText" }),
        defineField({ name: "courseRecords", type: "file" }),
      ],
      options: {
        collapsible: true,
      },
    }),
    defineField({
      name: "competitorInformation",
      type: "object",
      description: "Documents and information",
      fields: [
        defineField({ name: "description", type: "text", rows: 4 }),
        defineField({
          name: "documents",
          type: "array",
          of: [
            defineArrayMember({
              type: "file",
              name: "file",
              fields: [defineField({ name: "title", type: "string" })],
            }),
          ],
        }),
      ],
      options: {
        collapsible: true,
      },
    }),
    defineField({
      name: "courseMap",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "description", type: "text", rows: 4 }),
        defineField({ name: "map", type: "file" }),
        defineField({ name: "mapImage", title: "Map Image", type: "image" }),
      ],
      options: {
        collapsible: true,
      },
    }),
  ],
});

export default RegattaSettings;
