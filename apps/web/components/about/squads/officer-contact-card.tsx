import type { OfficerResponse } from "@sudburyrc/api";
import Link from "next/link";
import { Identity } from "@/components/contact/identity";
import { Button } from "@/components/ui/button";
import { getBrowserClient } from "@/lib/algolia";

const fetchOfficer = async (squadName: string) => {
  const client = getBrowserClient();
  const officer = await client.searchForHits<OfficerResponse>({
    requests: [{ indexName: "officers", query: squadName }],
  });

  return officer.results?.[0]?.hits[0];
};

export const OfficerContactCard = async ({ query }: { query: string }) => {
  const officer = await fetchOfficer(query);

  if (!officer) return null;

  return (
    <div className="flex max-w-sm items-center gap-3 rounded-sm border p-2">
      <Identity
        imageId={officer.avatar?._id}
        lqip={officer.avatar?.lqip}
        name={officer.name}
        description={officer.role}
      />

      <div className="flex-1" />

      <Button variant="brand" size="xs" className="mr-1" asChild>
        <Link href={`/contact?to=${officer._id}`}>Contact</Link>
      </Button>
    </div>
  );
};
