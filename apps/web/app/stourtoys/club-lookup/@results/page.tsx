import { clubs as allClubs } from "@sudburyrc/static";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cloudflareLoader } from "@/lib/loaders/cloudflare-loader";

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
        <Alert className="mb-2" variant="warn">
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
            href={club.href}
            key={club.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            {club.name}
            {clubs.length < MAX_CLUBS_WITH_BLADES && club.newBladeUrl && (
              <div className="absolute top-0 right-2 bottom-0 flex items-center">
                <Image
                  alt=""
                  className="h-4 w-8"
                  height={16}
                  loader={cloudflareLoader}
                  loading="lazy"
                  src={club.newBladeUrl}
                  width={32}
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
