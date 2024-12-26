import Container from "@/components/layouts/container";
import { MDXContent } from "@/components/mdx/mdx-content";
import Text from "@/components/stour/text";
import type { SerializableTOC } from "@fumadocs/content-collections/configuration";
import { smartQuotes } from "@sudburyrc/helpers";
import { AlignLeftIcon } from "lucide-react";

import { DocPageHeader } from "@/components/layouts/docPage/DocPageHeader";
import {
  DocPagePrePostNote,
  type PrePostNote,
} from "@/components/layouts/docPage/DocPagePrePostNote";
import { TableOfContents } from "@/components/layouts/docPage/TableOfContents";

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

      <div className="sticky top-0 hidden max-h-[100dvh] max-w-72 overflow-y-auto px-4 lg:block">
        <div className="sticky top-0 right-0 h-12 w-full bg-gradient-to-t from-transparent to-white" />

        <h2 className="mb-3 flex items-center gap-2 font-medium text-gray-700 text-sm">
          <AlignLeftIcon
            className="w-3 stroke-[3] stroke-current"
            aria-hidden
          />
          On this page
        </h2>
        <TableOfContents toc={toc} />
        <div className="sticky right-0 bottom-0 h-12 w-full bg-gradient-to-b bg-opacity-50 from-transparent to-white" />
      </div>
    </Container>
  );
};
