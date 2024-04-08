import Fireworks from "@fireworks-js/react";
import { ArrowRight } from "lucide-react";
import Link from "../stour/link";
import { Button } from "../ui/button";
import { HundredAndFiftyGradient } from "./150-gradient";
import { HundredAndFiftyLogo } from "./150-logo";

export const HundredAndFiftyCta = () => (
  <div className="relative isolate grid grid-cols-1 items-center overflow-hidden rounded-lg border bg-gray-900 text-white shadow md:grid-cols-3">
    <div className="mt-12 flex h-full items-center justify-center md:relative md:mt-0">
      <HundredAndFiftyLogo block={false} />
      <Fireworks
        className="absolute inset-0"
        options={{
          sound: { enabled: false },
          hue: { min: 190, max: 220 },
          intensity: 3.5,
        }}
      />
    </div>

    <HundredAndFiftyGradient />

    <div className="col-span-2 px-8 py-16">
      <p className="mb-1 text-lg font-medium text-sky-200">150th Anniversary</p>
      <h2 className="mb-6 text-3xl font-bold">Celebrating 150 years</h2>
      <p className="mb-10 opacity-70">
        This year, in celebration of the 150th anniversary of our foundation, we
        have created a space to share our history, our stories, and our
        memories. We invite you to join us in celebrating this milestone.
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
