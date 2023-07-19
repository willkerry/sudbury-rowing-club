import { ImageIcon, BlockquoteIcon, InfoOutlineIcon } from "@sanity/icons";

export default {
  name: "richText",
  title: "Rich Text",
  type: "array",
  of: [
    { type: "block" },
    { type: "figure", icon: ImageIcon },
    { type: "quote", icon: BlockquoteIcon },
    { type: "note", icon: InfoOutlineIcon },
  ],
};
