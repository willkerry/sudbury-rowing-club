import type { PortableTextProps } from "@portabletext/react";
import Text from "../stour/text";

type Props = {
  content: PortableTextProps["value"];
};

const PostBody = ({ content }: Props) => (
  <Text
    portableText={content}
    font="serif"
    lead
    className="mx-auto max-w-[650px]"
  />
);

export default PostBody;
