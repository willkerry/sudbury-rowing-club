import { defineArrayMember, defineField } from "sanity";

const Events = defineField({
  name: "event",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "course",
      type: "string",
      options: {
        direction: "horizontal",
        layout: "radio",
        list: ["350m", "650m"],
      },
    }),
    defineField({ name: "description", rows: 2, type: "text" }),
    defineField({ name: "categories", rows: 2, type: "text" }),
    defineField({ name: "gender", type: "string" }),
    defineField({
      name: "boatClasses",
      of: [defineArrayMember({ type: "string" })],
      type: "array",
      options: {
        layout: "grid",
        list: [
          { title: "8+", value: "8+" },
          { title: "4+", value: "4+" },
          { title: "4×−", value: "4×−" },
          { title: "4×+", value: "4×+" },
          { title: "2+", value: "2+" },
          { title: "2−", value: "2−" },
          { title: "2×", value: "2×" },
          { title: "1×", value: "1×" },
        ],
      },
    }),
    defineField({ name: "prizes", type: "string" }),
  ],
  options: {
    columns: 2,
  },
});

export default Events;
