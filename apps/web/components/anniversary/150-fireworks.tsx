import dynamic from "next/dynamic";

const Fireworks = dynamic(() => import("@fireworks-js/react"), { ssr: false });

export const HundredAndFiftyFireworks = () => (
  <Fireworks
    className="absolute inset-0"
    options={{
      hue: { min: 205, max: 220 },
      sound: { enabled: false },
      intensity: 5,
    }}
  />
);
