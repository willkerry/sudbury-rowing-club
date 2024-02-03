import React from "react";
import { defineArrayMember, defineField, defineType } from "sanity";

const forwarders = defineType({
  name: "forwarders",
  type: "document",
  title: "Forwarders",
  fields: [
    defineField({
      name: "alias",
      type: "slug",
      title: "Email Alias",
      description: (
        <p>
          This is first part of the email address. For example, if the email
          address is <code>captain@sudburyrowingclub.org.uk</code>, the alias is{" "}
          <code>captain</code>.
        </p>
      ),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recipients",
      type: "array",
      title: "Recipients",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "officers" } as const],
        }),
      ],
    }),
    defineField({
      name: "otherRecipients",
      type: "array",
      title: "Other Recipients",
      description:
        "If you need to forward to an email address that isn't in the 'officers' list, enter it here.",
      of: [
        defineArrayMember({
          type: "string",
          title: "Email Address",
          validation: (Rule) => Rule.email(),
        }),
      ],
    }),
  ],

  orderings: [
    {
      name: "aliasAsc",
      title: "Alias Ascending",
      by: [{ field: "alias.current", direction: "asc" }],
    },
    {
      name: "aliasDesc",
      title: "Alias Descending",
      by: [{ field: "alias.current", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      alias: "alias.current",
      recipients: "recipients",
      otherRecipients: "otherRecipients",
    },
    prepare({ alias, recipients, otherRecipients }) {
      const title = alias;

      if (!recipients && !otherRecipients) {
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
          totalRecipients
        )}`,
      };
    },
  },
});

export default forwarders;

function makePlural(base: string, number: number) {
  if (number === 1) return base;

  return `${base}s`;
}
