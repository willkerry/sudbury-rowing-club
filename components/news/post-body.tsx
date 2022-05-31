import Text from "../stour/text";
import { PortableTextProps } from "@portabletext/react";

type Props = {
  content: PortableTextProps["value"];
};

const PostBody = ({ content }: Props) => (
  <div className="mx-auto max-w-prose">
    <Text portableText={content} lead />
  </div>
);

export default PostBody;
