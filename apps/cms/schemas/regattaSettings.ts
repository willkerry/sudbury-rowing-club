import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const RegattaSettings = defineType({
  icon: CogIcon,
  name: "regattaSettings",
  title: "Regatta Settings",
  type: "document",
  fields: [
    defineField({
      description: "Name of the next regatta",
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      description: "Date of the next regatta",
      name: "date",
      type: "date",
    }),
    defineField({
      name: "landingPage",
      type: "regattaLandingPage",
    }),
    defineField({
      description:
        "A optional note, displayed near the top of the regatta landing page and homepage.",
      name: "note",
      type: "note",
    }),

    defineField({
      name: "events",
      type: "events",
    }),

    defineField({
      name: "entries",
      type: "entries",
    }),

    defineField({
      name: "results",
      type: "results",
    }),

    defineField({
      name: "competitorInformation",
      type: "competitorInformation",
    }),

    defineField({
      name: "courseMap",
      type: "courseMap",
    }),
  ],
});

export default RegattaSettings;
