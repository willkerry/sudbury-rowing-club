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
      <li className="mb-6 p-0" key={item.href}>
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
    description: "Search for rowing clubs and their blades.",
    href: "/stourtoys/club-lookup",
    name: "Club lookup",
  },
  {
    description: "Search the SRC website.",
    href: "/stourtoys/search",
    name: "Search",
  },
  {
    description: "Generate Open Graph images for sharing on social media.",
    href: "/stourtoys/share-image",
    name: "Share image generator",
  },
];

export const metadata = createMetadata({
  description: "Useful tools and utilities for Sudbury Rowing Club members.",
  image: { title: "StourToys 🧸" },
  title: "StourToys",
});

const StourToys = () => (
  <TextPage title="StourToys">
    <StourToyList items={stourToys} />
  </TextPage>
);

export default StourToys;
