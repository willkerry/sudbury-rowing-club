import { defineField, defineType } from "sanity";

const ResourceItem = defineType({
  name: "resourceItem",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({
      name: "fileOrLink",
      type: "string",
      options: {
        layout: "radio",
        list: ["Upload a file", "Enter a link"],
      },
    }),
    defineField({
      name: "file",
      title: "Upload a file",
      type: "file",
      hidden: ({ parent, value }) =>
        !value && parent?.fileOrLink === "Enter a link",
    }),
    defineField({
      name: "url",
      title: "Enter a link",
      type: "string",
      hidden: ({ parent, value }) =>
        !value && parent?.fileOrLink === "Upload a file",
    }),
  ],
});

export default ResourceItem;
