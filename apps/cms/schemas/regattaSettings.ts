import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const RegattaSettings = defineType({
  name: "regattaSettings",
  type: "document",
  title: "Regatta Settings",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Name of the next regatta",
    }),
    defineField({
      name: "date",
      type: "date",
      description: "Date of the next regatta",
    }),
    defineField({
      type: "regattaLandingPage",
      name: "landingPage",
    }),
    defineField({
      type: "note",
      name: "note",
      description:
        "A optional note, displayed near the top of the regatta landing page and homepage.",
    }),

    defineField({
      type: "events",
      name: "events",
    }),

    defineField({
      type: "entries",
      name: "entries",
    }),

    defineField({
      type: "results",
      name: "results",
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
