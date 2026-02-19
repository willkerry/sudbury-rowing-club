import { WarningOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const SafetyStatus = defineType({
  icon: WarningOutlineIcon,
  name: "safetyStatus",
  title: "Safety Status",
  type: "document",
  // __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"],

  fields: [
    defineField({
      name: "status",
      type: "string",
      options: {
        direction: "horizontal",
        layout: "radio",
        list: [
          { title: "Neutral", value: "neutral" },
          { title: "Green", value: "green" },
          { title: "Amber", value: "amber" },
          { title: "Red", value: "red" },
        ],
      },
    }),
    defineField({ name: "description", type: "text" }),
    defineField({
      description: "Display the safety widget",
      name: "display",
      type: "boolean",
    }),
  ],
});

export default SafetyStatus;
