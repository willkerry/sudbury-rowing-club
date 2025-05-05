import { ScrollLink } from "@/components/utils/scroll-link";
import { HeartHandshake } from "lucide-react";
import Link from "next/link";
import Sponsors from "../landing/sponsors";
import Container from "../layouts/container";
import Label from "../stour/label";
import { Button } from "../ui/button";

export const SponsorshipHero = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Container className="py-16 text-center text-gray-900 sm:py-24" id="hero">
    <Label className="sm:mb-3">{title}</Label>
    <h1 className="relative z-10 bg-linear-to-br from-emerald-400 to-blue-700 bg-clip-text font-semibold text-6xl text-transparent drop-shadow-xl sm:text-8xl">
      Sponsor us{" "}
      <HeartHandshake className="inline h-12 w-12 rotate-6 text-gray-500 drop-shadow-2xl sm:h-16 sm:w-16" />
    </h1>

    <div className="prose mx-auto mt-12 mb-16 max-w-xl text-left">
      <p className="lead">{description}</p>
    </div>

    <div className="flex justify-center gap-2 pb-12">
      <ScrollLink
        to="sponsorship-tiers"
        offset={-175}
        smooth
        className="text-white"
      >
        <Button variant="secondary" size="lg">
          Learn more
        </Button>
      </ScrollLink>
      <Button asChild size="lg">
        <Link href="/contact?q=sponsorship,secretary">Enquire now</Link>
      </Button>
    </div>

    <Sponsors heading="Our sponsors" />
  </Container>
);
