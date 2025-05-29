import { defineArrayMember, defineField } from "sanity";

const FileDocumentGroup = defineField({
  name: "fileDocumentGroup",
  type: "object",
  options: {
    columns: 2,
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "documents",
      type: "array",
      of: [
        defineArrayMember({
          type: "file",
          title: "Documents",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Title",
            }),
          ],
        }),
      ],
    }),
  ],
});

export default FileDocumentGroup;
