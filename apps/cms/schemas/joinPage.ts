import { AddUserIcon } from "@sanity/icons/AddUser";
import { defineArrayMember, defineField, defineType } from "sanity";

const JoinPage = defineType({
  description: "Content displayed on the join page.",
  icon: AddUserIcon,
  name: "joinPage",
  title: "Join Page",
  type: "document",
  fields: [
    defineField({
      description: "The steps from first contact to joining a rowing squad.",
      name: "stages",
      title: "Learn to Row stages",
      type: "array",
      of: [
        defineArrayMember({
          name: "stage",
          type: "object",
          fields: [
            defineField({
              name: "name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "content",
              rows: 3,
              type: "text",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      description:
        "The “What can you do at Sudbury Rowing Club?” sections, in display order.",
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({
          name: "section",
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              description: "Shown beneath the title in the side navigation.",
              name: "subtitle",
              type: "string",
            }),
            defineField({
              name: "image",
              type: "image",
              fields: [
                defineField({
                  description:
                    "Describe the image for users who cannot see it (e.g. due to visual impairment).",
                  name: "alt",
                  title: "Alternative text",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
              ],
              options: { hotspot: true },
            }),
            defineField({
              name: "content",
              type: "array",
              of: [
                defineArrayMember({
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
                    ],
                  },
                  styles: [{ title: "Normal", value: "normal" }],
                  type: "block",
                }),
              ],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { media: "image", subtitle: "subtitle", title: "title" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Join Page" }),
  },
});

export default JoinPage;
