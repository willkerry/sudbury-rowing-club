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
  orderings: [
    {
      name: "yearDesc",
      title: "Latest",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      name: "yearAsc",
      title: "Earliest",
      by: [{ field: "year", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      range: "range",
      media: "image",
    },
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
  },
});

export default Archive;
