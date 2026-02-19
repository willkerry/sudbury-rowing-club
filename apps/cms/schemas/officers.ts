import { UsersIcon } from "@sanity/icons";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

const Officers = defineType({
  icon: UsersIcon,
  name: "officers",
  orderings: [orderRankOrdering],
  title: "Club Officers",
  type: "document",
  fields: [
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),

    defineField({
      name: "occupant",
      to: [{ type: "person" } as const],
      type: "reference",
    }),

    defineField({
      name: "vacant",
      title: "Is this position vacant?",
      type: "boolean",
    }),
    defineField({
      name: "description",
      rows: 2,
      title: "Role description",
      type: "text",
      validation: (Rule) => Rule.max(175),
    }),
    defineField({ name: "image", type: "figure" }),
    orderRankField({ type: "officers" }),
  ],

  preview: {
    prepare(selection) {
      const { title, name, surname, media, vacant } = selection;

      const makeSubtitle = () => {
        if (vacant) return "Vacant";

        return `${name} ${surname}`;
      };

      return {
        subtitle: makeSubtitle(),
        title: title,
        media,
      };
    },
    select: {
      media: "occupant.image.image",
      name: "occupant.firstName",
      override: "override",
      overrideName: "name",
      surname: "occupant.surname",
      title: "role",
      vacant: "vacant",
    },
  },
});

export default Officers;
