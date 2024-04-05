import { ArchiveIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const Archive = defineType({
  name: "archive",
  type: "document",
  title: "Archive",
  icon: ArchiveIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "year",
      type: "date",
      title: "Year",
      options: {
        dateFormat: "YYYY",
      },
    }),
    defineField({
      name: "range",
      type: "number",
      title: "Range",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
    }),
    defineField({
      name: "alt",
      type: "string",
      title: "Alt Text",
    }),
    defineField({
      name: "location",
      type: "geopoint",
      title: "Location",
    }),
  ],
});

export default Archive;
