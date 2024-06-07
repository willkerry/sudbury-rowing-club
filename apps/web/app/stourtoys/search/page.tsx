import { createMetaData } from "@/lib/create-metadata";
import TextPage from "@/components/layouts/text-page";
import { SiteSearch } from "@/components/search";

export const metadata = createMetaData({
  title: "Search the site",
  description: "Find stuff on here",
});

const Clubs = () => (
  <TextPage
    title="Search the site"
    color="transparent"
    description="Find stuff on here"
    prose="max-w-prose"
  >
    <SiteSearch />
  </TextPage>
);

export default Clubs;
