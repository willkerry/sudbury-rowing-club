import TextPage from "@/components/layouts/text-page";
import { SiteSearch } from "@/components/search";
import { createMetadata } from "@/lib/create-metadata";

export const metadata = createMetadata({
  title: "Search the site",
  description: "Find stuff on here",
});

const Clubs = () => (
  <TextPage title="Search the site" color="transparent" prose="max-w-prose">
    <SiteSearch />
  </TextPage>
);

export default Clubs;
