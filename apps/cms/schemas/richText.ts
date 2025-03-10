import {
  BlockquoteIcon,
  DocumentVideoIcon,
  ImageIcon,
  InfoOutlineIcon,
} from "@sanity/icons";
import { defineArrayMember, defineType } from "sanity";

const RichText = defineType({
  name: "richText",
  title: "Rich Text",
  type: "array",
  of: [
    defineArrayMember({ type: "block" }),
    defineArrayMember({ type: "figure", icon: ImageIcon }),
    defineArrayMember({ type: "quote", icon: BlockquoteIcon }),
    defineArrayMember({ type: "note", icon: InfoOutlineIcon }),
    defineArrayMember({ type: "oembed", icon: DocumentVideoIcon }),
  ],
});

export default RichText;
