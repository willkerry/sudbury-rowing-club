import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const SponsorshipTiers = ({
  tiers,
  emphasisedIndex,
}: {
  tiers: Record<
    string,
    {
      description: string;
      benefits: string[];
    }
  >;
  emphasisedIndex?: number;
}) => (
  <ul
    className="my-12 grid gap-8 rounded sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:border"
    id="sponsorship-tiers"
  >
    {Object.entries(tiers).map(([tier, { benefits, description }], i) => (
      <li
        className={cn(
          i === emphasisedIndex
            ? "-my-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-xl"
            : "border-b px-3 py-6 lg:border-b-0 lg:py-2",
          emphasisedIndex &&
            i !== emphasisedIndex - 1 &&
            i !== Object.keys(tiers).length - 1
            ? "lg:border-r"
            : "",
        )}
        key={tier}
      >
        <h3 className="mb-3 font-semibold text-lg">{tier}</h3>
        <p className="mb-3 min-h-16 text-gray-700">{description}</p>

        <Button
          asChild
          className="mb-4 w-full"
          variant={i === emphasisedIndex ? "brand" : "secondary"}
          shadow={i === emphasisedIndex}
          size="xs"
        >
          <Link href="/contact?q=sponsorship,secretary">
            {i === emphasisedIndex ? "Sponsor a boat" : "Enquire"}
          </Link>
        </Button>

        <ul className="my-2 grid grid-cols-1 gap-2 font-medium text-sm">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-x-2">
              <Check className="mt-1.5 h-4 w-4 flex-none text-blue-600" />
              {benefit}
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);
