import type { SerializableTOC } from "@fumadocs/content-collections/configuration";
import { smartQuotes } from "@sudburyrc/helpers";
import { IconAlignLeft } from "@tabler/icons-react";
import type { MDXContent as MDXContentType } from "mdx/types";
import { Container } from "@/components/layouts/container";
import { DocPageHeader } from "@/components/layouts/docPage/DocPageHeader";
import {
  DocPagePrePostNote,
  type PrePostNote,
} from "@/components/layouts/docPage/DocPagePrePostNote";
import { TableOfContents } from "@/components/layouts/docPage/TableOfContents";
import { MDXContent } from "@/components/mdx/mdx-content";
import { Text } from "@/components/stour/text";

export const DocPage = ({
  title,
  description,
  prenotes,
  postnotes,
  content,
  toc,
}: {
  title: string;
  description?: string;
  prenotes?: PrePostNote[];
  postnotes?: PrePostNote[];
  content: MDXContentType;
  toc: SerializableTOC;
}) => {
  const smartTitle = smartQuotes(title);
  const smartDescription = smartQuotes(description);

  return (
    <Container className="relative flex justify-between">
      <Text className="my-12">
        <DocPageHeader description={smartDescription} title={smartTitle} />

        {prenotes && <DocPagePrePostNote notes={prenotes} />}

        <MDXContent content={content} />

        {postnotes && (
          <>
            <hr />
            <DocPagePrePostNote notes={postnotes} />
          </>
        )}
      </Text>

      <div className="sticky top-0 hidden max-h-[100dvh] max-w-72 overflow-y-auto px-4 lg:block">
        <div className="sticky top-0 right-0 h-12 w-full bg-linear-to-t from-transparent to-white" />

        <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
          <IconAlignLeft aria-hidden className="w-3 stroke-current stroke-3" />
          On this page
        </h2>
        <TableOfContents toc={toc} />
        <div className="bg-opacity-50 sticky right-0 bottom-0 h-12 w-full bg-linear-to-b from-transparent to-white" />
      </div>
    </Container>
  );
};
