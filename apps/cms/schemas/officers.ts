import { UsersIcon } from "@sanity/icons/Users";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineArrayMember, defineField, defineType } from "sanity";

const Officers = defineType({
  icon: UsersIcon,
  name: "officers",
  orderings: [orderRankOrdering],
  title: "Club Officers",
  type: "document",
  fields: [
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({
      description:
        "The role’s own address, e.g. captain@sudburyrowingclub.org.uk. Messages sent through the website go here.",
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),

    defineField({
      name: "occupants",
      title: "Occupants",
      type: "array",
      of: [
        defineArrayMember({
          to: [{ type: "person" } as const],
          type: "reference",
        }),
      ],
    }),
    defineField({
      deprecated: { reason: "Use the Occupants field instead." },
      name: "occupant",
      readOnly: true,
      to: [{ type: "person" } as const],
      type: "reference",
      hidden: ({ value }) => !value,
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
      const { title, first0, surname0, first1, surname1, media, vacant } =
        selection;

      const makeSubtitle = () => {
        if (vacant) return "Vacant";

        return [
          first0 && `${first0} ${surname0}`,
          first1 && `${first1} ${surname1}`,
        ]
          .filter(Boolean)
          .join(" and ");
      };

      return {
        subtitle: makeSubtitle(),
        title: title,
        media,
      };
    },
    select: {
      first0: "occupants.0.firstName",
      first1: "occupants.1.firstName",
      media: "occupants.0.image.image",
      surname0: "occupants.0.surname",
      surname1: "occupants.1.surname",
      title: "role",
      vacant: "vacant",
    },
  },
});

export default Officers;
