"use client";

import { Marker, Map as PigeonMap, type Point } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";
import type { ComponentProps } from "react";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

if (!MAPTILER_KEY) {
  throw new Error("MAPTILER_KEY is not set");
}

type LocationMapProps = {
  defaultCenter: Point;
  markers: ComponentProps<typeof Marker>[];
};

const maptilerProvider = maptiler(MAPTILER_KEY, "uk-openzoomstack-road");

export const LocationMap = ({ defaultCenter, markers }: LocationMapProps) => (
  <PigeonMap
    attribution={false}
    defaultCenter={defaultCenter}
    defaultZoom={14}
    dprs={[1, 2]}
    height={565}
    provider={maptilerProvider}
  >
    {markers.map((marker) => (
      <Marker key={String(marker.anchor)} {...marker} />
    ))}
  </PigeonMap>
);
