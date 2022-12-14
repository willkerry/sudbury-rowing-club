import { DropIcon } from "@sanity/icons";

export default {
  name: "safety",
  type: "document",
  title: "Safety",
  icon: DropIcon,
  fields: [
    { name: "title", type: "string", title: "Title" },
    { name: "body", type: "richText", title: "Body" },
    {
      name: "document",
      type: "file",
      title: "Document",
      fields: [
        {
          name: "title",
          type: "string",
          title: "Title",
        },
      ],
    },
    {
      name: "link",
      type: "object",
      title: "Link",
      fields: [
        {
          name: "title",
          type: "string",
          title: "Title",
        },
        {
          name: "url",
          type: "url",
          title: "URL",
        },
      ],
    },
    { name: "date", type: "date", title: "Date Updated" },
  ],
};
