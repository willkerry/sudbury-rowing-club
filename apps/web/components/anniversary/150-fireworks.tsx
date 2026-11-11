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
        hue: { max: 220, min: 205 },
        intensity: 5,
        mouse: { click: true, move: false },
      }}
    />
  );
};
