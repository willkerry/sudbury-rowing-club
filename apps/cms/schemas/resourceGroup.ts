import { defineArrayMember, defineField, defineType } from "sanity";

const ResourceGroup = defineType({
  name: "resourceGroup",
  type: "object",
  fields: [
    defineField({ name: "groupTitle", type: "string" }),
    defineField({
      name: "resources",
      of: [defineArrayMember({ type: "resourceItem" })],
      type: "array",
    }),
  ],
  options: {
    columns: 2,
  },
});

export default ResourceGroup;
