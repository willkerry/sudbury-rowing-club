import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HOSTNAME } from "@/lib/constants";

export const SiteSearch = () => (
  <form
    action="https://www.google.com/search"
    className="flex items-center"
    method="get"
  >
    <input name="sitesearch" type="hidden" value={HOSTNAME} />
    <Input
      aria-label="Search our site with Google"
      autoComplete="off"
      className="w-full"
      name="q"
      placeholder="Search our site with Google"
      type="search"
    />
    <Button icon={<Search />} type="submit" variant="link">
      Search
    </Button>
  </form>
);
