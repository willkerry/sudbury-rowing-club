import { BillIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const Members = defineType({
  icon: BillIcon,
  name: "members",
  title: "Members’ Notices",
  type: "document",
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
        maxLength: 96,
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "meta",

      of: [defineArrayMember({ type: "labelValueItem" })],
      type: "array",
      options: {
        modal: {
          type: "popover",
        },
      },
    }),
    defineField({ name: "body", title: "Body", type: "richText" }),
    defineField({
      name: "documents",
      type: "fileDocumentGroupArray",
    }),
  ],
});

export default Members;
