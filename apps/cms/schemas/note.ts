export default {
  name: "note",
  title: "Note",
  type: "object",
  fields: [
    {
      name: "label",
      type: "string",
    },
    {
      name: "note",
      type: "text",
    },
    {
      name: "type",
      type: "string",
      initialValue: "primary",
      options: {
        list: ["primary", "secondary", "success", "warning", "error"],
      },
    },
  ],
};
