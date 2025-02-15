import { defineArrayMember, defineField, defineType } from "sanity";

const Note = defineType({
  name: "note",
  title: "Note",
  type: "object",
  fields: [
    defineField({
      name: "display",
      type: "boolean",
      description: "If set to false, the note will not be displayed.",
    }),
    defineField({
      name: "label",
      type: "string",
      description: "Displayed in bold",
    }),
    defineField({
      name: "link",
      type: "url",
      description:
        "If set, no text will be displayed and the banner will link to this URL (useful, for example, for linking to the draw).",
    }),
    defineField({
      name: "text",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "type",
      type: "string",
      initialValue: "primary",
      options: {
        list: ["primary", "secondary", "success", "warning", "error"],
      },
      description:
        "The type of note to display: primary is suitable for most, secondary is bad or sad, success is green, warning is yellow, and error is red.",
    }),
    defineField({
      name: "date",
      type: "date",
      description:
        "If text is set and this date is not blank, it will be displated below the text. Acts as a 'last updated' date.",
    }),
  ],
});

export default Note;
