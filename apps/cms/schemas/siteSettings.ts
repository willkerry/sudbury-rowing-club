import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const SiteSettings = defineType({
  name: "siteSettings",
  type: "document",
  title: "Site Settings",
  icon: CogIcon,
  fields: [
    defineField({
      type: "object",
      name: "landingPage",
      title: "Landing Page",
      description: "Content displayed on the main landing page.",
      options: {
        collapsible: true,
      },
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "tagline", type: "text", rows: 2 }),
        defineField({ name: "description", type: "richText" }),
        defineField({
          name: "note",
          type: "object",
          description:
            "A optional note, displayed near the top of the landing page.",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "display", type: "boolean" }),
            defineField({ name: "text", type: "text" }),
            defineField({
              name: "type",
              type: "string",
              initialValue: "primary",
              options: {
                list: ["primary", "secondary", "success", "warning", "error"],
              },
            }),
          ],
          options: {
            collapsible: true,
          },
        }),
        defineField({
          type: "object",
          name: "heroImage",
          options: {
            collapsible: true,
          },
          fields: [
            defineField({ name: "image", type: "image" }),
            defineField({
              name: "youtubeId",
              title: "YouTube video ID",
              type: "string",
              description:
                "The ID string from any YouTube video. For example, `https://www.youtube.com/watch?v=2EiBu6A7KhA` gives us 2EiBu6A7KhA",
            }),
            defineField({
              name: "youtubeStartOffset",
              title: "YouTube start offset",
              type: "number",
              description:
                "When should the video start (in seconds from the beginning).",
            }),
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
      type: "array",
      name: "governanceResources",
      description: "Links and downloads related to the running of the club. ",
      of: [
        defineArrayMember({
          type: "object",
          options: {
            columns: 2,
          },
          fields: [
            defineField({ name: "groupTitle", type: "string" }),
            defineField({
              name: "resources",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "item",
                  fields: [
                    defineField({ type: "string", name: "name" }),
                    defineField({
                      type: "string",
                      name: "fileOrLink",
                      options: {
                        list: ["Upload a file", "Enter a link"],
                        layout: "radio",
                      },
                    }),
                    defineField({
                      type: "file",
                      name: "file",
                      title: "Upload a file",
                      hidden: ({ parent, value }) =>
                        !value && parent?.fileOrLink === "Enter a link",
                    }),
                    defineField({
                      type: "string",
                      name: "url",
                      title: "Enter a link",
                      hidden: ({ parent, value }) =>
                        !value && parent?.fileOrLink === "Upload a file",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

export default SiteSettings;
