import { MdSummarize } from "react-icons/md";
import {format} from 'date-fns';

export default {
  name: "minutes",
  type: "document",
  title: "Minutes",
  icon: MdSummarize,
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
      const dateObject = new Date(date);
      const dateString = format(dateObject, "d MMMM yyyy");

      return {
        title: title,
        subtitle: dateString,
      };
    },
  },
};
