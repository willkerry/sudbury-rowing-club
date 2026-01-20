"use client";

import Fireworks from "@fireworks-js/react";
import { useReducedMotion } from "@mantine/hooks";

export const HundredAndFiftyFireworks = () => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <Fireworks
      className="absolute inset-0"
      options={{
        hue: { min: 205, max: 220 },
        intensity: 5,
        mouse: { click: true, move: false },
      }}
    />
  );
};
