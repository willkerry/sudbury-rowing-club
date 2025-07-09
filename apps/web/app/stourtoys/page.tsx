import Link from "next/link";
import TextPage from "@/components/layouts/text-page";
import { createMetadata } from "@/lib/create-metadata";

type StourToy = {
  name: string;
  href: string;
  description: string;
};

const StourToyList = ({ items }: { items: StourToy[] }) => (
  <ul className="list-none pl-0">
    {items.map((item) => (
      <li key={item.href} className="mb-6 p-0">
        <Link className="p-0 font-semibold leading-tight" href={item.href}>
          {item.name}
        </Link>
        <span className="block p-0 leading-tight">{item.description}</span>
      </li>
    ))}
  </ul>
);

const stourToys: StourToy[] = [
  {
    name: "Club Lookup",
    href: "/stourtoys/club-lookup",
    description: "Search for rowing clubs and their blades.",
  },
  {
    name: "Search",
    href: "/stourtoys/search",
    description: "Search the SRC website.",
  },
];

export const metadata = createMetadata({
  title: "StourToys",
});

const StourToys = () => (
  <TextPage title="StourToys">
    <StourToyList items={stourToys} />
  </TextPage>
);

export default StourToys;
