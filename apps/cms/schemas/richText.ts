import { BlockquoteIcon } from "@sanity/icons/Blockquote";
import { DocumentVideoIcon } from "@sanity/icons/DocumentVideo";
import { ImageIcon } from "@sanity/icons/Image";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
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
