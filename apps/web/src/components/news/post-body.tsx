import type { PortableTextProps } from "@portabletext/react";
import { Text } from "@/components/stour/text";

type Props = {
  content: PortableTextProps["value"];
};

export const PostBody = ({ content }: Props) => (
  <Text
    className="mx-auto max-w-[650px]"
    font="serif"
    lead
    portableText={content}
  />
);
