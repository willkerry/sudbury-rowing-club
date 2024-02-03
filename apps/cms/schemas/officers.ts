import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

const Officers = defineType({
  name: "officers",
  type: "document",
  title: "Club Officers",
  icon: UsersIcon,
  fields: [
    defineField({ name: "role", type: "string", title: "Role" }),
    defineField({ name: "name", type: "string", title: "Name" }),
    defineField({ name: "email", type: "string", title: "Email" }),

    defineField({
      name: "occupant",
      type: "reference",
      to: [{ type: "person" }],
    }),

    defineField({
      name: "vacant",
      type: "boolean",
      title: "Is this position vacant?",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Role description",
      rows: 2,
      validation: (Rule) => Rule.max(175),
    }),
    defineField({ name: "image", type: "figure" }),
    orderRankField({ type: "officers" }),
  ],
  orderings: [orderRankOrdering],

  preview: {
    select: {
      title: "role",
      name: "occupant.firstName",
      surname: "occupant.surname",
      media: "occupant.image.image",
      override: "override",
      overrideName: "name",
      vacant: "vacant",
    },
    prepare(selection: {
      title: string;
      name: string;
      surname: string;
      media: any;
      vacant: boolean;
    }) {
      const { title, name, surname, media, vacant } = selection;

      const makeSubtitle = () => {
        if (vacant) return "Vacant";

        return name + " " + surname;
      };

      return {
        title: title,
        subtitle: makeSubtitle(),
        media,
      };
    },
  },
});

export default Officers;
