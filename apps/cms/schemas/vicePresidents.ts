import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const VicePresidents = defineType({
  icon: UsersIcon,
  name: "vicePresidents",
  title: "Vice-Presidents",
  type: "document",
  fields: [
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
    }),
    defineField({ name: "surname", title: "Surname", type: "string" }),
    defineField({
      name: "reference",
      to: [{ type: "person" } as const],
      type: "reference",
    }),
  ],
  preview: {
    prepare(selection) {
      const { firstName, surname, media } = selection;

      return {
        title: `${firstName} ${surname}`,
        media,
      };
    },
    select: {
      firstName: "reference.firstName",
      media: "reference.image.image",
      surname: "reference.surname",
    },
  },
});

export default VicePresidents;
