import { defineField, defineType } from "sanity";

const Note = defineType({
  name: "note",
  title: "Note",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
    }),
    defineField({
      name: "note",
      type: "text",
    }),
    defineField({
      name: "type",
      type: "string",
      initialValue: "primary",
      options: {
        list: ["primary", "secondary", "success", "warning", "error"],
      },
    }),
  ],
});

export default Note;
