import { CommentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const Committee = defineType({
  name: "committees",
  type: "document",
  title: "Committees",
  icon: CommentIcon,
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      rows: 2,
    }),
    defineField({
      name: "members",
      type: "array",
      title: "Committee Members",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "officers" } as const],
        }),
      ],
    }),
  ],
});

export default Committee;
