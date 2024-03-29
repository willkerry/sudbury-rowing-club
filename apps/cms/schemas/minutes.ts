import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const Minutes = defineType({
  name: "minutes",
  type: "document",
  title: "Minutes",
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: "date", type: "datetime", title: "Date" }),
    defineField({ name: "file", type: "file", title: "File" }),
    defineField({
      name: "public",
      type: "boolean",
      title: "Public",
      initialValue: false,
      description:
        "Should this be visible to the public? Only publish minutes from which confidential information has been redacted.",
    }),
    defineField({
      name: "committee",
      type: "reference",
      title: "Committee",
      to: [{ type: "committees" } as const],
      options: {
        disableNew: true,
      },
    }),
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
});

export default Minutes;
