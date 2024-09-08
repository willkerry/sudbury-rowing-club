import { defineArrayMember, defineField } from "sanity";

const FileDocumentGroupArray = defineField({
  name: "fileDocumentGroupArray",
  type: "array",
  of: [defineArrayMember({ type: "fileDocumentGroup" })],
});

export default FileDocumentGroupArray;
