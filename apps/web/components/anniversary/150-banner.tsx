import Fireworks from "@fireworks-js/react";
import Container from "../layouts/container";
import { HundredAndFiftyGradient } from "./150-gradient";
import { HundredAndFiftyLogo } from "./150-logo";

export const HundredAndFiftyBanner = () => (
  <div className="relative isolate overflow-hidden bg-gray-900 py-2 text-white">
    <Fireworks
      className="absolute inset-0"
      options={{
        hue: { min: 205, max: 220 },
        sound: { enabled: false },
        intensity: 5,
      }}
    />

    <HundredAndFiftyGradient size="sm" />

    <Container>
      <HundredAndFiftyLogo />
    </Container>
  </div>
);
