import { CommentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const Committee = defineType({
  icon: CommentIcon,
  name: "committees",
  title: "Committees",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "description",
      rows: 2,
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "members",
      title: "Committee Members",
      type: "array",
      of: [
        defineArrayMember({
          to: [{ type: "officers" } as const],
          type: "reference",
        }),
      ],
    }),
  ],
});

export default Committee;
