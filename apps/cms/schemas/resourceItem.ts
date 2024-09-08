import { defineField, defineType } from "sanity";

const ResourceItem = defineType({
  type: "object",
  name: "resourceItem",
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
});

export default ResourceItem;
