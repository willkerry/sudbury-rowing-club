import { Search } from "lucide-react";
import { HOSTNAME } from "@/lib/constants";
import { Button } from "../ui/button";

export const SiteSearch = () => (
  <form
    action="https://www.google.com/search"
    method="get"
    className="flex items-center"
  >
    <input type="hidden" name="q" value={`site:${HOSTNAME}`} />
    <label htmlFor="search" className="sr-only">
      Search our site with Google
    </label>
    <input
      name="q"
      placeholder="Search our site with Google"
      type="search"
      className="m-0"
    />
    <Button type="submit" icon={<Search />} variant="link">
      Search
    </Button>
  </form>
);
