import Container from "@/components/layouts/container";
import { AlignLeftIcon } from "lucide-react";
import { MDXContent } from "@/components/mdx/mdx-content";
import Text from "@/components/stour/text";
import type { SerializableTOC } from "@fumadocs/content-collections/configuration";
import { smartQuotes } from "@sudburyrc/helpers";

import { TableOfContents } from "@/components/layouts/docPage/TableOfContents";
import { DocPageHeader } from "@/components/layouts/docPage/DocPageHeader";
import {
  DocPagePrePostNote,
  type PrePostNote,
} from "@/components/layouts/docPage/DocPagePrePostNote";

export const DocPage = ({
  title,
  description,
  prenotes,
  postnotes,
  body,
  toc,
}: {
  title: string;
  description?: string;
  prenotes?: PrePostNote[];
  postnotes?: PrePostNote[];
  body: string;
  toc: SerializableTOC;
}) => {
  const smartTitle = smartQuotes(title);
  const smartDescription = smartQuotes(description);

  return (
    <Container className="relative flex justify-between">
      <Text className="my-12">
        <DocPageHeader title={smartTitle} description={smartDescription} />

        {prenotes && <DocPagePrePostNote notes={prenotes} />}

        <MDXContent code={body} />

        {postnotes && (
          <>
            <hr />
            <DocPagePrePostNote notes={postnotes} />
          </>
        )}
      </Text>

      <div className="max-w-72 max-h-[100dvh] overflow-y-auto hidden lg:block sticky top-0 px-4">
        <div className="sticky top-0 bg-gradient-to-t from-transparent to-white right-0 w-full h-12" />

        <h2 className="text-sm font-medium text-gray-700 mb-3 gap-2 flex items-center">
          <AlignLeftIcon
            className="w-3 stroke-[3] stroke-current"
            aria-hidden
          />
          On this page
        </h2>
        <TableOfContents toc={toc} />
        <div className="sticky bottom-0 right-0 w-full h-12 bg-gradient-to-b from-transparent to-white bg-opacity-50" />
      </div>
    </Container>
  );
};
