import allClubs from "@/data/clubs.json";
import Link from "next/link";

const ClubSearchResults = async (props: {
  searchParams: Promise<{
    q?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  if (!searchParams.q) return null;

  const clubs = allClubs.filter((club) =>
    club.name.toLowerCase().includes(searchParams.q?.toLowerCase() || ""),
  );

  if (!clubs || clubs.length === 0) {
    return <p className="my-12 text-center text-gray-500">No results found</p>;
  }

  if (clubs.length > 64) {
    return (
      <p className="my-12 text-center text-gray-500">
        Too many results, please narrow your search
      </p>
    );
  }

  return (
    <div className="divide-y rounded border">
      {clubs.map((club) => (
        <Link
          className="relative block p-2 hover:bg-gray-50"
          key={club.href}
          href={club.href}
        >
          {club.name}
          {clubs.length < 10 && club.bladeUrl && (
            <div className="absolute top-0 right-2 bottom-0 flex items-center">
              <img
                className="h-6 w-12"
                src={club.bladeUrl}
                alt=""
                loading="lazy"
              />
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default ClubSearchResults;
