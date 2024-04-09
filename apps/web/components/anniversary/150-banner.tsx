import Link from "next/link";
import Container from "../layouts/container";
import { HundredAndFiftyFireworks } from "./150-fireworks";
import { HundredAndFiftyGradient } from "./150-gradient";
import { HundredAndFiftyLogo } from "./150-logo";

export const HundredAndFiftyBanner = () => (
  <div className="relative isolate overflow-hidden bg-gray-900 py-2 text-white">
    <HundredAndFiftyFireworks />
    <HundredAndFiftyGradient size="sm" />

    <Container>
      <Link href="/150">
        <HundredAndFiftyLogo />
      </Link>
    </Container>
  </div>
);
