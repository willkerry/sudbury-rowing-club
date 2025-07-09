import type { Governance } from "@sudburyrc/api";
import { SectionTitle, SubTitle } from "@/components/governance";
import { Link } from "@/components/stour/link";
import { BASE_URL } from "@/lib/constants";

type Props = {
  documents: Governance["documents"];
};

export const Documents = ({ documents }: Props) => (
  <section className="max-w-lg pt-6 pb-12 sm:pt-12" id="documents">
    <SectionTitle>Documents</SectionTitle>
    {documents.map((group) => (
      <div key={group._key} className="mt-6">
        <SubTitle>{group.groupTitle}</SubTitle>
        <ul className="space-y-1">
          {group.resources.map((doc) => (
            <li key={doc._key}>
              <Link
                download={doc.fileOrLink === "Upload a file"}
                external={
                  doc.fileOrLink === "Enter a link" &&
                  !doc?.url?.includes(BASE_URL) &&
                  doc?.url?.includes("http")
                }
                href={doc.url ? doc.url : `${doc.file}?dl=`}
              >
                {doc.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);
