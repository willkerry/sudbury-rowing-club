import { BillIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const Members = defineType({
  name: "members",
  type: "document",
  title: "Members’ Notices",
  icon: BillIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "meta",
      type: "array",
      options: {
        modal: {
          type: "popover",
        },
      },

      of: [
        defineArrayMember({
          type: "object",
          options: {
            columns: 2,
          },
          fields: [
            { name: "label", type: "string" },
            { name: "value", type: "string" },
          ],
        }),
      ],
    }),
    defineField({ name: "body", type: "richText", title: "Body" }),
    defineField({
      name: "documents",
      type: "array",
      of: [
        {
          name: "group",
          type: "object",
          options: {
            columns: 2,
          },
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
            },
            {
              name: "documents",
              type: "array",
              of: [
                {
                  name: "documents",
                  type: "file",
                  title: "Documents",
                  fields: [
                    {
                      name: "title",
                      type: "string",
                      title: "Title",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
});

export default Members;
