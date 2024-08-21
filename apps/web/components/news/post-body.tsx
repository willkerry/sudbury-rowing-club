import type { PortableTextProps } from "@portabletext/react";
import Text from "../stour/text";

type Props = {
  content: PortableTextProps["value"];
};

const PostBody = ({ content }: Props) => (
  <div className="mx-auto max-w-prose">
    <Text portableText={content} lead />
  </div>
);

export default PostBody;
