import { MdTraffic } from "react-icons/md";

export default {
  name: "safetyStatus",
  type: "document",
  title: "Safety Status",
  icon: MdTraffic,
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'], 
  fields: [
    {
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
    },
    { name: "description", type: "text" },
    { name: "display", type: "boolean", description: "Display the safety widget" },
  ],
};
