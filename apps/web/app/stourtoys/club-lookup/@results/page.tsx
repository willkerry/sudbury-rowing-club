import { Alert, AlertDescription } from "@/components/ui/alert";
import allClubs from "@/data/clubs.json";
import { cloudflareLoader } from "@/lib/loaders/cloudflare-loader";
import Image from "next/image";
import Link from "next/link";

const MAX_CLUBS = 64;
const MAX_CLUBS_WITH_BLADES = 10;

const ClubSearchResults = async (props: {
  searchParams: Promise<{
    q?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  if (!searchParams.q) return null;

  const searchTerm = searchParams.q.toLowerCase();

  const clubs = allClubs.filter(
    ({ name, address }) =>
      name.toLowerCase().includes(searchTerm) ||
      address.toLowerCase().includes(searchTerm),
  );

  if (!clubs || clubs.length === 0) {
    return <p className="my-12 text-center text-gray-500">No results found</p>;
  }

  if (clubs.length > MAX_CLUBS) {
    return (
      <Alert variant="warn">
        <AlertDescription>
          Over {MAX_CLUBS} results found. Please narrow your search.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {clubs.length > MAX_CLUBS_WITH_BLADES && (
        <Alert variant="warn" className="mb-2">
          <AlertDescription>
            When more than {MAX_CLUBS_WITH_BLADES} results are found, this
            service doesn&apos;t fetch blade images.
          </AlertDescription>
        </Alert>
      )}

      <div className="divide-y rounded-sm border">
        {clubs.map((club) => (
          <Link
            className="relative block p-2 hover:bg-gray-50"
            key={club.id}
            href={club.href}
          >
            {club.name}
            {clubs.length < MAX_CLUBS_WITH_BLADES && club.newBladeUrl && (
              <div className="absolute top-0 right-2 bottom-0 flex items-center">
                <Image
                  className="h-4 w-8"
                  src={club.newBladeUrl}
                  alt=""
                  loader={cloudflareLoader}
                  width={32}
                  height={16}
                  loading="lazy"
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    </>
  );
};

export default ClubSearchResults;
