import { MdQuestionAnswer} from "react-icons/md";

export default {
  name: "committees",
  type: "document",
  title: "Committees",
  icon: MdQuestionAnswer,
  fields: [
    { name: "title", type: "string", title: "Title" },
    { name: "description", type: "text", title: "Description", rows: 2 },

    {
      name: "members",
      type: "array",
      title: "Committee Members",
      of: [
        {
          type: "reference",
          to: [{ type: "officers" }],
        },
      ],
    },
  ],
};
