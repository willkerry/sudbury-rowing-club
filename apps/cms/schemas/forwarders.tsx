import { defineArrayMember, defineField, defineType } from "sanity";

const forwarders = defineType({
  name: "forwarders",
  title: "Forwarders",
  type: "document",
  fields: [
    defineField({
      description: (
        <p>
          This is first part of the email address. For example, if the email
          address is <code>captain@sudburyrowingclub.org.uk</code>, the alias is{" "}
          <code>captain</code>.
        </p>
      ),
      name: "alias",
      title: "Email Alias",
      type: "slug",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recipients",
      title: "Recipients",
      type: "array",
      of: [
        defineArrayMember({
          to: [{ type: "officers" } as const],
          type: "reference",
        }),
      ],
    }),
    defineField({
      description:
        "If you need to forward to an email address that isn't in the 'officers' list, enter it here.",
      name: "otherRecipients",
      title: "Other Recipients",
      type: "array",
      of: [
        defineArrayMember({
          title: "Email Address",
          type: "string",
          validation: (Rule) => Rule.email(),
        }),
      ],
    }),
  ],

  orderings: [
    {
      by: [{ direction: "asc", field: "alias.current" }],
      name: "aliasAsc",
      title: "Alias Ascending",
    },
    {
      by: [{ direction: "desc", field: "alias.current" }],
      name: "aliasDesc",
      title: "Alias Descending",
    },
  ],

  preview: {
    prepare({ alias, recipients, otherRecipients }) {
      const title = alias;

      if (!(recipients || otherRecipients)) {
        return {
          title,
          subtitle: "No recipients",
        };
      }

      if (!recipients) recipients = [];
      if (!otherRecipients) otherRecipients = [];

      const totalRecipients = otherRecipients.length + recipients.length;

      return {
        title,
        subtitle: `${totalRecipients} ${makePlural(
          "recipient",
          totalRecipients,
        )}`,
      };
    },
    select: {
      alias: "alias.current",
      otherRecipients: "otherRecipients",
      recipients: "recipients",
    },
  },
});

export default forwarders;

function makePlural(base: string, number: number) {
  if (number === 1) return base;

  return `${base}s`;
}
