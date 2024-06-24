import { Search } from "lucide-react";
import { HOSTNAME } from "@/lib/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const SiteSearch = () => (
  <form
    action="https://www.google.com/search"
    method="get"
    className="flex items-center"
  >
    <Input
      name="q"
      placeholder="Search our site with Google"
      type="search"
      className="w-full"
      aria-label="Search our site with Google"
    />
    <Button type="submit" icon={<Search />} variant="link">
      Search
    </Button>
  </form>
);
