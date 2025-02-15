import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

const SiteSettings = defineType({
  name: "siteSettings",
  type: "document",
  title: "Site Settings",
  icon: CogIcon,
  fields: [
    defineField({
      type: "landingPage",
      name: "landingPage",
    }),

    defineField({
      type: "array",
      name: "governanceResources",
      description: "Links and downloads related to the running of the club. ",
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
