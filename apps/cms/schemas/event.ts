import { defineArrayMember, defineField } from "sanity";

const Events = defineField({
  name: "event",
  type: "object",
  options: {
    columns: 2,
  },
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "course",
      type: "string",
      options: {
        list: ["350m", "650m"],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "categories", type: "text", rows: 2 }),
    defineField({ name: "gender", type: "string" }),
    defineField({
      name: "boatClasses",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { value: "8+", title: "8+" },
          { value: "4+", title: "4+" },
          { value: "4×−", title: "4×−" },
          { value: "4×+", title: "4×+" },
          { value: "2+", title: "2+" },
          { value: "2−", title: "2−" },
          { value: "2×", title: "2×" },
          { value: "1×", title: "1×" },
        ],
        layout: "grid",
      },
    }),
    defineField({ name: "prizes", type: "string" }),
  ],
});

export default Events;
