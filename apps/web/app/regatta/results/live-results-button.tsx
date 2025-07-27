"use client";

import { RadioTowerIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { REGATTA } from "@/lib/constants";

export const LiveResultsButton = ({ regattaDate }: { regattaDate: Date }) => {
  const isDayOfRegatta =
    regattaDate.toDateString() === new Date().toDateString();

  if (!isDayOfRegatta)
    return (
      <Button asChild>
        <Link href="/regatta/draw">Draw information</Link>
      </Button>
    );

  return (
    <Button asChild icon={<RadioTowerIcon />} variant="success">
      <a href={REGATTA.LIVE_RESULTS_URL}>Live results</a>
    </Button>
  );
};
