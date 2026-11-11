import { defineArrayMember, defineField } from "sanity";

const FileDocumentGroup = defineField({
  name: "fileDocumentGroup",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "documents",
      type: "array",
      of: [
        defineArrayMember({
          title: "Documents",
          type: "file",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  options: {
    columns: 2,
  },
});

export default FileDocumentGroup;
