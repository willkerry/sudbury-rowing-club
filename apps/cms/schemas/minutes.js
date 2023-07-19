import { DocumentTextIcon } from "@sanity/icons";

export default {
  name: "minutes",
  type: "document",
  title: "Minutes",
  icon: DocumentTextIcon,
  fields: [
    { name: "date", type: "datetime", title: "Date" },
    { name: "file", type: "file", title: "File" },
    {
      name: "committee",
      type: "reference",
      title: "Committee",
      to: [{ type: "committees" }],
      options: {
        disableNew: true,
      },
    },
  ],
  preview: {
    select: {
      title: "committee.title",
      date: "date",
    },
    prepare(selection) {
      const { title, date } = selection;
      const dateString = new Date(date).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return {
        title: title,
        subtitle: dateString,
      };
    },
  },
};
