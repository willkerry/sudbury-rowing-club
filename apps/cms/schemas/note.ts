import { defineArrayMember, defineField, defineType } from "sanity";

const Note = defineType({
  name: "note",
  title: "Note",
  type: "object",
  fields: [
    defineField({
      description: "If set to false, the note will not be displayed.",
      name: "display",
      type: "boolean",
    }),
    defineField({
      description: "Displayed in bold",
      name: "label",
      type: "string",
    }),
    defineField({
      description:
        "If set, no text will be displayed and the banner will link to this URL (useful, for example, for linking to the draw).",
      name: "link",
      type: "string",
    }),
    defineField({
      name: "text",
      of: [defineArrayMember({ type: "block" })],
      type: "array",
    }),
    defineField({
      description:
        "The type of note to display: primary is suitable for most, secondary is bad or sad, success is green, warning is yellow, and error is red.",
      initialValue: "primary",
      name: "type",
      type: "string",
      options: {
        list: ["primary", "secondary", "success", "warning", "error"],
      },
    }),
    defineField({
      description:
        "If text is set and this date is not blank, it will be displated below the text. Acts as a 'last updated' date.",
      name: "date",
      type: "datetime",
    }),
    defineField({
      description:
        "If set to true, the time will be displayed in the 'last updated' date.",
      name: "includeTime",
      type: "boolean",
    }),
  ],
});

export default Note;
