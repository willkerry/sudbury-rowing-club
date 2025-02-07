import { ArrowRight } from "lucide-react";
import Link from "../stour/link";
import { Button } from "../ui/button";
import { HundredAndFiftyFireworks } from "./150-fireworks";
import { HundredAndFiftyGradient } from "./150-gradient";
import { HundredAndFiftyLogo } from "./150-logo";

export const HundredAndFiftyCta = () => (
  <div className="relative isolate grid grid-cols-1 items-center overflow-hidden rounded-lg border bg-gray-900 text-white shadow md:grid-cols-3">
    <div className="mt-12 flex h-full items-center justify-center md:relative md:my-12">
      <HundredAndFiftyLogo block={false} />
      <HundredAndFiftyFireworks />
    </div>

    <HundredAndFiftyGradient />

    <div className="col-span-2 px-8 py-16">
      <p className="mb-1 font-medium text-lg text-sky-200">150th Anniversary</p>
      <h2 className="mb-6 font-bold text-3xl">Celebrating 150 years</h2>
      <p className="mb-10 opacity-70">
        In 2024, in celebration of the 150th anniversary of our foundation, we
        created a space to share our history, our stories, and our memories. We
        invited you to join us in celebrating this milestone.
      </p>
      <Button asChild variant="secondary">
        <Link href="/150">Visit the mini-site</Link>
      </Button>

      <Button
        asChild
        variant="link"
        className="text-white hover:text-white"
        icon={<ArrowRight />}
      >
        <Link href="/150/gallery">View the gallery</Link>
      </Button>
    </div>
  </div>
);
