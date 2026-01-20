import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HOSTNAME } from "@/lib/constants";

export const SiteSearch = () => (
  <form
    action="https://www.google.com/search"
    method="get"
    className="flex items-center"
  >
    <input type="hidden" name="sitesearch" value={HOSTNAME} />
    <Input
      name="q"
      placeholder="Search our site with Google"
      type="search"
      autoComplete="off"
      className="w-full"
      aria-label="Search our site with Google"
    />
    <Button type="submit" icon={<Search />} variant="link">
      Search
    </Button>
  </form>
);
