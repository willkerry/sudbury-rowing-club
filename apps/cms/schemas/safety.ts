import { DropIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const Safety = defineType({
  name: "safety",
  type: "document",
  title: "Safety",
  icon: DropIcon,
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "body", type: "richText", title: "Body" }),
    defineField({
      name: "document",
      type: "file",
      title: "Document",
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Title",
        }),
      ],
    }),
    defineField({
      name: "link",
      type: "object",
      title: "Link",
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Title",
        }),
        defineField({
          name: "url",
          type: "url",
          title: "URL",
        }),
      ],
    }),
    defineField({ name: "date", type: "date", title: "Date Updated" }),
  ],
});

export default Safety;
