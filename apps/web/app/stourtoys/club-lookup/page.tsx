"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Clubs = () => {
  const router = useRouter();

  return (
    <form
      className="mb-4 flex items-center"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`?q=${encodeURIComponent(e.currentTarget.q.value)}`);
      }}
    >
      <label className="sr-only" htmlFor="q">
        Search
      </label>
      <Input
        autoComplete="off"
        className="flex-1"
        id="q"
        name="q"
        type="search"
      />
      <Button icon={<Search />} type="submit" variant="link">
        Search
      </Button>
    </form>
  );
};

export default Clubs;
