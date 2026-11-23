import TextPage from "@/components/layouts/text-page";
import { SiteSearch } from "@/components/search";
import { createMetadata } from "@/lib/create-metadata";

export const metadata = createMetadata({
  description: "Find stuff on here",
  image: { title: "Search 🔍" },
  title: "Search the site",
});

const Clubs = () => (
  <TextPage prose="max-w-prose" title="Search the site">
    <SiteSearch />
  </TextPage>
);

export default Clubs;
