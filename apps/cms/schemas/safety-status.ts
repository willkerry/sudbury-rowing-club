import { WarningOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const SafetyStatus = defineType({
  name: "safetyStatus",
  type: "document",
  title: "Safety Status",
  icon: WarningOutlineIcon,
  // __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"],

  fields: [
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "Neutral", value: "neutral" },
          { title: "Green", value: "green" },
          { title: "Amber", value: "amber" },
          { title: "Red", value: "red" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "display",
      type: "boolean",
      description: "Display the safety widget",
    }),
  ],
});

export default SafetyStatus;
