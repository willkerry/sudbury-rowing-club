import { fetchArchives } from "@sudburyrc/api";
import type { Metadata } from "next";
import { select } from "radashi";
import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import { Container } from "@/components/layouts/container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createMetadata } from "@/lib/create-metadata";
import { MemoryMap } from "./memory-map";

const TITLE = "150th Anniversary Memory Map" as const;
const DESCRIPTION =
  "Explore where our 150 years of memories took place" as const;

export const metadata: Metadata = {
  ...createMetadata({
    title: TITLE,
    description: DESCRIPTION,
    image: {
      subtitle: "1874–2024",
    },
  }),
};

const MemoryMapPage = async () => {
  const archives = await fetchArchives();

  const locations = select(
    archives,
    (archive) => ({
      coordinates: [archive.location?.lng, archive.location?.lat] as [
        number,
        number,
      ],
      weight: 20,
    }),
    (archive) => !!archive.location?.lat && !!archive.location?.lng,
  );

  return (
    <>
      <HundredAndFiftyHeader title="Memory Map" href="/150" />

      <Container>
        <Alert variant="default" className="mb-8">
          <AlertTitle>Hint</AlertTitle>
          <AlertDescription>
            Zoom out to see more photo locations.
          </AlertDescription>
        </Alert>

        <div className="relative mb-12 aspect-3/2 overflow-hidden rounded-sm border shadow-lg">
          <MemoryMap locations={locations} />
        </div>
      </Container>
    </>
  );
};

export default MemoryMapPage;
