import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const SiteSettings = defineType({
  icon: CogIcon,
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "landingPage",
      type: "landingPage",
    }),

    defineField({
      description: "Links and downloads related to the running of the club. ",
      name: "governanceResources",
      type: "array",
      of: [
        defineArrayMember({
          type: "resourceGroup",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "landingPage.title",
    },
  },
});

export default SiteSettings;
