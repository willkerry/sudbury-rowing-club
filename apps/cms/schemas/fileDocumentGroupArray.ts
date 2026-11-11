import { defineArrayMember, defineField } from "sanity";

const FileDocumentGroupArray = defineField({
  name: "fileDocumentGroupArray",
  of: [defineArrayMember({ type: "fileDocumentGroup" })],
  type: "array",
});

export default FileDocumentGroupArray;
