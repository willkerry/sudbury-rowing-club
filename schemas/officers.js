import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { MdPeople } from "react-icons/md";

export default {
  name: "officers",
  type: "document",
  title: "Club Officers",
  icon: MdPeople,
  fields: [
    { name: "role", type: "string", title: "Role" },
    { name: "name", type: "string", title: "Name" },
    { name: "email", type: "string", title: "Email" },
    { name: "vacant", type: "boolean", title: "Is this position vacant?" },
    {
      name: "description",
      type: "text",
      title: "Role description",
      rows: 2,
      validation: (Rule) => Rule.max(175),
    },
    { name: "image", type: "figure" },
    orderRankField({ type: "officers" }),
    // { name: "order", type: "number", title: "Sort Order", hidden: false },
  ],
  orderings: [orderRankOrdering],
  // {
  //   title: "Display Order",
  //   name: "orderAsc",
  //   by: [{ field: "order", direction: "asc" }],
  // },

  preview: {
    select: {
      title: "role",
      subtitle: "name",
    },
  },
};
