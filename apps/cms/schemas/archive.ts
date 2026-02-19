import { ArchiveIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const Archive = defineType({
  icon: ArchiveIcon,
  name: "archive",
  title: "Archive",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "date",
      options: {
        dateFormat: "YYYY",
      },
    }),
    defineField({
      name: "range",
      title: "Range",
      type: "number",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "geopoint",
    }),
  ],
  orderings: [
    {
      by: [{ direction: "desc", field: "year" }],
      name: "yearDesc",
      title: "Latest",
    },
    {
      by: [{ direction: "asc", field: "year" }],
      name: "yearAsc",
      title: "Earliest",
    },
  ],
  preview: {
    prepare({ title, year, range, media }) {
      const midYear = new Date(year).getFullYear();
      const startYear = midYear - range;
      const endYear = midYear + range;

      const hasRange = range > 0;
      const hasYear = year;

      const subtitle =
        hasYear && hasRange
          ? `c. ${startYear}-${endYear}`
          : hasYear
            ? `${midYear}`
            : "No year";

      return {
        title,
        subtitle,
        media,
      };
    },
    select: {
      media: "image",
      range: "range",
      title: "title",
      year: "year",
    },
  },
});

export default Archive;
