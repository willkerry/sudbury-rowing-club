import { CalendarIcon } from "@sanity/icons";

export default {
  name: "regattas",
  title: "Regattas",
  type: "document",
  icon: CalendarIcon,
  fields: [
    { name: "date", title: "Date", type: "date", required: true },
    { name: "number", title: "Number", type: "number", required: true },
    { name: "results", title: "Link to results", type: "url" },
    {
      name: "galleries",
      title: "Links to photos",
      type: "array",
      of: [
        {
          name: "gallery",
          title: "Photo provider",
          type: "object",
          fields: [
            {
              name: "name",
              type: "string",
              title: "Provider name",
              required: true,
            },
            {
              name: "url",
              type: "url",
              title: "URL to photo provider",
              required: true,
            },
            {
              name: "password",
              type: "string",
              title: "Password",
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: "testimonials",
      title: "Praise for the regatta",
      type: "array",
      of: [
        {
          name: "testimonial",
          title: "Testimonial",
          type: "object",
          fields: [
            {
              name: "text",
              type: "text",
              title: "Text",
              required: true,
            },
            {
              name: "name",
              type: "string",
              title: "Name",
              description: "Leave blank to display testimonial as ‘Anonymous’.",
            },
            {
              name: "club",
              type: "string",
              title: "Club",
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "number",
      subtitle: "date",
    },
  },
};
