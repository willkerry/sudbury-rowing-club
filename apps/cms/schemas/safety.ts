import { DropIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const Safety = defineType({
  icon: DropIcon,
  name: "safety",
  title: "Safety",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "body", title: "Body", type: "richText" }),
    defineField({ name: "pin", title: "Pin to top", type: "boolean" }),
    defineField({
      name: "document",
      title: "Document",
      type: "file",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "link",
      type: "link",
    }),
    defineField({ name: "date", title: "Date Updated", type: "date" }),
  ],
});

export default Safety;
