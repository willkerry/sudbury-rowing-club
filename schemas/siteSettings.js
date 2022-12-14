export default {
  name: "siteSettings",
  type: "document",
  title: "Site Settings",
  // __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"],
  fields: [
    {
      name: "landingPage",
      title: "Landing Page",
      description: "Content displayed on the main landing page.",
      type: "object",
      options: {
        collapsible: true,
      },
      fields: [
        { name: "title", type: "string" },
        { name: "tagline", type: "text", rows: 2 },
        { name: "description", type: "richText" },
        {
          name: "note",
          type: "object",
          description:
            "A optional note, displayed near the top of the landing page.",
          fields: [
            { name: "label", type: "string" },
            { name: "display", type: "boolean" },
            { name: "text", type: "text" },
            {
              name: "type",
              type: "string",
              initialValue: "primary",
              options: {
                list: ["primary", "secondary", "success", "warning", "error"],
              },
            },
          ],
          options: {
            collapsible: true,
          },
        },
        {
          name: "heroImage",
          type: "object",
          options: {
            collapsible: true,
          },
          fields: [
            { name: "image", type: "image" },
            {
              name: "youtubeId",
              title: "YouTube video ID",
              type: "string",
              description:
                "The ID string from any YouTube video. For example, `https://www.youtube.com/watch?v=2EiBu6A7KhA` gives us 2EiBu6A7KhA",
            },
            {
              name: "youtubeStartOffset",
              title: "YouTube start offset",
              type: "number",
              description:
                "When should the video start (in seconds from the beginning).",
            },
          ],
        },
        {
          name: "images",
          type: "array",
          options: {
            layout: "grid",
          },
          of: [
            {
              name: "image",
              type: "image",

              fields: [
                {
                  name: "caption",
                  type: "string",
                  title: "Caption",
                },
              ],
            },
          ],
        },
      ],
    },

    {
      name: "governanceResources",
      type: "array",
      description: "Links and downloads related to the running of the club. ",
      of: [
        {
          type: "object",
          options: {
            columns: 2,
          },
          fields: [
            { name: "groupTitle", type: "string" },
            {
              name: "resources",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "item",
                  fields: [
                    { type: "string", name: "name" },
                    {
                      type: "string",
                      name: "fileOrLink",
                      options: {
                        list: ["Upload a file", "Enter a link"],
                        layout: "radio",
                      },
                    },
                    {
                      type: "file",
                      name: "file",
                      title: "Upload a file",
                      hidden: ({ parent, value }) =>
                        !value && parent?.fileOrLink === "Enter a link",
                    },
                    {
                      type: "string",
                      name: "url",
                      title: "Enter a link",
                      hidden: ({ parent, value }) =>
                        !value && parent?.fileOrLink === "Upload a file",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      options: {
        collapsible: true,
      },
    },
  ],
};
