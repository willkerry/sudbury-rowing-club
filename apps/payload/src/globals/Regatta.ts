import type { GlobalConfig } from "payload";

export const Regatta: GlobalConfig = {
  label: "Settings",
  slug: "regatta",

  admin: {
    group: "Regatta",
  },

  fields: [
    {
      type: "tabs",
      tabs: [
        {
          description:
            "Headline copy and the image carousel that runs across the top of the regatta page.",
          label: "Overview",
          fields: [
            { name: "title", type: "text" },
            { name: "date", type: "date" },
            { name: "tagline", type: "text" },
            { name: "description", type: "richText" },
            {
              labels: { plural: "Images", singular: "Image" },
              name: "images",
              type: "array",
              fields: [
                {
                  name: "image",
                  relationTo: "media",
                  type: "upload",
                },
              ],
            },
          ],
        },
        {
          description: "Race programme — one entry per race day course.",
          label: "Events",
          fields: [
            {
              labels: { plural: "Events", singular: "Event" },
              name: "events",
              type: "array",
              fields: [
                { name: "title", type: "text" },
                { name: "description", type: "textarea" },
                { name: "gender", type: "text" },
                { name: "prizes", type: "text" },
                {
                  name: "course",
                  type: "radio",
                  options: [
                    { label: "350m", value: "350m" },
                    { label: "650m", value: "650m" },
                  ],
                },
                { name: "categories", type: "textarea" },
                {
                  hasMany: true,
                  name: "boatClasses",
                  type: "select",
                  options: [
                    { label: "8+", value: "8+" },
                    { label: "4+", value: "4+" },
                    { label: "4×−", value: "4x-" },
                    { label: "4×+", value: "4x+" },
                    { label: "2+", value: "2+" },
                    { label: "2−", value: "2-" },
                    { label: "2×", value: "2x" },
                    { label: "1×", value: "1x" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Entries",
          fields: [
            {
              name: "entries",
              type: "group",
              fields: [
                { name: "description", type: "richText" },
                // work out how to represent the wave matrix
              ],
            },
          ],
        },
        {
          label: "Results",
          fields: [
            {
              name: "results",
              type: "group",
              fields: [
                { name: "description", type: "richText" },
                {
                  name: "courseRecords",
                  relationTo: "media",
                  type: "upload",
                },
              ],
            },
            {
              name: "liveResultsUrl",
              type: "text",
              admin: {
                description:
                  "Public live-results dashboard, shown during the regatta.",
              },
            },
          ],
        },
        {
          label: "Course map",
          fields: [
            {
              name: "course",
              type: "group",
              fields: [
                { name: "heading", type: "text" },
                { name: "description", type: "richText" },
                {
                  name: "map",
                  relationTo: "media",
                  type: "upload",
                },
                {
                  name: "mapImage",
                  relationTo: "media",
                  type: "upload",
                },
              ],
            },
          ],
        },
        {
          description:
            "Where the regatta happens. Used in schema.org markup and for visitor wayfinding.",
          label: "Venue",
          fields: [
            {
              name: "venue",
              type: "group",
              fields: [
                { name: "name", type: "text" },
                { name: "street", type: "text" },
                { name: "town", type: "text" },
                { name: "county", type: "text" },
                { name: "postcode", type: "text" },
              ],
            },
          ],
        },
        {
          description:
            "Copy that frames the testimonials section. The testimonial quotes themselves live on individual regatta records.",
          label: "Testimonials",
          fields: [
            {
              name: "testimonialsSection",
              type: "group",
              fields: [
                {
                  defaultValue: "Feedback",
                  name: "title",
                  type: "text",
                },
                { name: "description", type: "textarea" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
