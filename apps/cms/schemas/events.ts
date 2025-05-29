import { defineArrayMember, defineField } from "sanity";

const Events = defineField({
  type: "object",
  name: "events",
  description: "Race lengths at the regatta",
  fields: [
    defineField({
      name: "events",
      type: "array",
      of: [defineArrayMember({ type: "event" })],
    }),
  ],
  options: {
    collapsible: true,
  },
});

export default Events;
