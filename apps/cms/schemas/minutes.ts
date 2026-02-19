import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const Minutes = defineType({
  icon: DocumentTextIcon,
  name: "minutes",
  title: "Minutes",
  type: "document",
  fields: [
    defineField({ name: "date", title: "Date", type: "datetime" }),
    defineField({ name: "file", title: "File", type: "file" }),
    defineField({
      description:
        "Should this be visible to the public? Only publish minutes from which confidential information has been redacted.",
      initialValue: false,
      name: "public",
      title: "Public",
      type: "boolean",
    }),
    defineField({
      name: "committee",
      title: "Committee",
      to: [{ type: "committees" } as const],
      type: "reference",
      options: {
        disableNew: true,
      },
    }),
  ],
  preview: {
    prepare(selection) {
      const { title, date } = selection;
      const dateString = new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return {
        subtitle: dateString,
        title: title,
      };
    },
    select: {
      date: "date",
      title: "committee.title",
    },
  },
});

export default Minutes;
