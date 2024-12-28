"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

const Clubs = (props: { searchParams: Promise<{ q?: string }> }) => {
  const searchParams = use(props.searchParams);
  const router = useRouter();

  return (
    <form
      className="mb-4 flex items-center"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`?q=${encodeURIComponent(e.currentTarget.q.value)}`);
      }}
    >
      <label htmlFor="q" className="sr-only">
        Search
      </label>
      <Input
        type="search"
        aria-label="Search"
        className="flex-1"
        placeholder={searchParams.q ?? "Search"}
        name="q"
      />
      <Button type="submit" icon={<Search />} variant="link">
        Search
      </Button>
    </form>
  );
};

export default Clubs;
