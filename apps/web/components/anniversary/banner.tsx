import Fireworks from "@fireworks-js/react";
import Container from "../layouts/container";
import Crest from "../logo/crest";
import { Numeral } from "./numeral";

export const Banner = () => (
  <div className="relative bg-blue-900 py-2 text-blue-50">
    <Fireworks
      className="absolute inset-0"
      options={{
        hue: { min: 205, max: 220 },
        sound: { enabled: false },
        intensity: 5,
      }}
    />

    <Container>
      <div className="my-8 flex flex-col items-center justify-center gap-4">
        <Crest className="z-10 w-20" />
        <Numeral className="z-10" />
      </div>
    </Container>
  </div>
);
