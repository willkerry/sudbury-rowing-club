import { BillIcon } from "@sanity/icons";

export default {
  name: "members",
  type: "document",
  title: "Members’ Notices",
  icon: BillIcon,
  fields: [
    { name: "title", type: "string", required: true },
    {
      name: "slug",
      type: "slug",
      required: true,
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "meta",
      type: "array",
      options: {
        modal: "popover",
      },
      of: [
        {
          type: "object",
          options: {
            columns: 2,
          },
          fields: [
            { name: "label", type: "string" },
            { name: "value", type: "string" },
          ],
        },
      ],
    },
    { name: "body", type: "richText", title: "Body" },
    {
      name: "documents",
      type: "array",
      of: [
        {
          name: "group",
          type: "object",
          options: {
            columns: 2,
          },
          fields: [
            {
              name: "title",
              type: "string",
              title: "Title",
            },
            {
              name: "documents",
              type: "array",
              of: [
                {
                  name: "documents",
                  type: "file",
                  title: "Documents",
                  fields: [
                    {
                      name: "title",
                      type: "string",
                      title: "Title",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
