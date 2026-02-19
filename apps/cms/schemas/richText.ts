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
    defineArrayMember({ icon: ImageIcon, type: "figure" }),
    defineArrayMember({ icon: BlockquoteIcon, type: "quote" }),
    defineArrayMember({ icon: InfoOutlineIcon, type: "note" }),
    defineArrayMember({ icon: DocumentVideoIcon, type: "oembed" }),
  ],
});

export default RichText;
