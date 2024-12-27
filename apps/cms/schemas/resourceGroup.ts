import { defineArrayMember, defineField, defineType } from "sanity";

const ResourceGroup = defineType({
  name: "resourceGroup",
  type: "object",
  options: {
    columns: 2,
  },
  fields: [
    defineField({ name: "groupTitle", type: "string" }),
    defineField({
      name: "resources",
      type: "array",
      of: [
        defineArrayMember({
          type: "resourceItem",
          name: "item",
        }),
      ],
    }),
  ],
});

export default ResourceGroup;
