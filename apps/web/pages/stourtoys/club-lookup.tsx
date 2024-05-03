import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import TextPage from "@/components/layouts/text-page";

const getClubs = () => import("@/data/clubs.json").then((mod) => mod.default);

type Club = Awaited<ReturnType<typeof getClubs>>[number];

const ClubSearchResults = ({ clubs }: { clubs?: Club[] }) => {
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
        <a
          className="relative block p-2 hover:bg-gray-50"
          key={club.href}
          href={club.href}
        >
          {club.name}
          {clubs.length < 10 && club.bladeUrl && (
            <div className="absolute bottom-0 right-2 top-0 flex items-center">
              <img
                className="h-6 w-12"
                src={club.bladeUrl}
                alt=""
                loading="lazy"
              />
            </div>
          )}
        </a>
      ))}
    </div>
  );
};

const Clubs = () => {
  const [query, setQuery] = useState("");
  const [debounced] = useDebouncedValue(query, 200);

  const { data: clubs } = useQuery({
    queryKey: ["clubs"],
    queryFn: getClubs,
    staleTime: Infinity,
  });

  const filteredClubs = clubs?.filter((club) =>
    club.name.toLowerCase().includes(debounced.toLowerCase()),
  );

  return (
    <TextPage
      title="Rowing club lookup"
      color="transparent"
      description="Search for rowing clubs and their blades"
      prose="max-w-prose"
    >
      <form className="mb-4">
        <input
          type="search"
          aria-label="Search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {debounced && <ClubSearchResults clubs={filteredClubs} />}
    </TextPage>
  );
};

export default Clubs;
