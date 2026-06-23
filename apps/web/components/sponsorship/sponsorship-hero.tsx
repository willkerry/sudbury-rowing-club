"use client";

import { HeartHandshake } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Sponsors } from "@/components/landing/sponsors";
import { Container } from "@/components/layouts/container";
import { Label } from "@/components/stour/label";
import { Button } from "@/components/ui/button";
import { ScrollLink } from "@/components/utils/scroll-link";

const ease = [0.25, 1, 0.5, 1] as const;

export const SponsorshipHero = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <Container className="py-16 text-center text-gray-900 sm:py-24">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease }}
      >
        <Label className="sm:mb-3">{title}</Label>
      </motion.div>

      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-linear-to-br from-emerald-400 to-blue-700 bg-clip-text font-semibold text-6xl text-transparent drop-shadow-xl sm:text-8xl"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        transition={{ delay: 0.1, duration: 0.6, ease }}
      >
        Sponsor us{" "}
        <motion.span
          animate={{ opacity: 1, rotate: 6, scale: 1 }}
          className="inline-block"
          initial={
            reducedMotion ? false : { opacity: 0, rotate: -12, scale: 0.5 }
          }
          transition={{
            damping: 12,
            delay: 0.4,
            stiffness: 200,
            type: "spring",
          }}
        >
          <HeartHandshake className="inline h-12 w-12 text-gray-500 drop-shadow-2xl sm:h-16 sm:w-16" />
        </motion.span>
      </motion.h1>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="prose mx-auto mt-12 mb-16 max-w-xl text-left"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        transition={{ delay: 0.25, duration: 0.5, ease }}
      >
        <p className="lead">{description}</p>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center gap-2 pb-12"
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        transition={{ delay: 0.4, duration: 0.4, ease }}
      >
        <ScrollLink
          className="text-white"
          offset={-175}
          smooth
          to="sponsorship-tiers"
        >
          <Button size="lg" variant="secondary">
            See sponsorship tiers
          </Button>
        </ScrollLink>
        <Button asChild size="lg">
          <Link href="/contact?q=sponsorship,secretary,chair">Enquire now</Link>
        </Button>
      </motion.div>

      <motion.div
        animate={{ opacity: 1 }}
        initial={reducedMotion ? false : { opacity: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease }}
      >
        <Sponsors heading="Our sponsors" />
      </motion.div>
    </Container>
  );
};
