"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.25, 1, 0.5, 1] as const;

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
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <ul
      className="my-12 grid gap-8 rounded-sm sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:border"
      id="sponsorship-tiers"
    >
      {Object.entries(tiers).map(([tier, { benefits, description }], i) => (
        <motion.li
          className={cn(
            "",
            i === emphasisedIndex
              ? "-my-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 shadow-xl"
              : "border-b px-3 py-2 lg:border-b-0",
            emphasisedIndex &&
              i !== emphasisedIndex &&
              i !== emphasisedIndex - 1 &&
              i !== Object.keys(tiers).length - 1
              ? "lg:border-r"
              : "",
          )}
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          key={tier}
          transition={{ delay: i * 0.1, duration: 0.4, ease }}
          viewport={{ margin: "-50px", once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold text-lg">{tier}</h3>
          <p className="mb-3 min-h-16 text-gray-700">{description}</p>

          <Button
            asChild
            className="mb-4 w-full"
            shadow={i === emphasisedIndex}
            size="xs"
            variant={i === emphasisedIndex ? "brand" : "secondary"}
          >
            <Link href="/contact?q=sponsorship,secretary,chair">
              {i === emphasisedIndex ? "Sponsor a boat" : "Enquire"}
            </Link>
          </Button>

          <ul className="my-2 grid grid-cols-1 gap-2 font-medium text-sm">
            {benefits.map((benefit, j) => (
              <motion.li
                className="flex gap-x-2"
                initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                key={benefit}
                transition={{
                  delay: i * 0.1 + j * 0.04,
                  duration: 0.3,
                  ease,
                }}
                viewport={{ margin: "-30px", once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <Check className="mt-1.5 h-4 w-4 flex-none text-blue-600" />
                {benefit}
              </motion.li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ul>
  );
};
