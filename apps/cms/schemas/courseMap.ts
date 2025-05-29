import { defineField } from "sanity";

const CourseMap = defineField({
  name: "courseMap",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "map", type: "file" }),
    defineField({ name: "mapImage", title: "Map Image", type: "image" }),
  ],
  options: {
    collapsible: true,
  },
});

export default CourseMap;
