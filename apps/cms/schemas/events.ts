import { defineArrayMember, defineField } from "sanity";

const Events = defineField({
  description: "Race lengths at the regatta",
  name: "events",
  type: "object",
  fields: [
    defineField({
      name: "events",
      of: [defineArrayMember({ type: "event" })],
      type: "array",
    }),
  ],
  options: {
    collapsible: true,
  },
});

export default Events;
