import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { UsersIcon } from "@sanity/icons";

export default {
  name: "officers",
  type: "document",
  title: "Club Officers",
  icon: UsersIcon,
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
  ],
  orderings: [orderRankOrdering],

  preview: {
    select: {
      title: "role",
      subtitle: "name",
    },
  },
};
