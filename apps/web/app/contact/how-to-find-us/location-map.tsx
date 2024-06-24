"use client";

import { ComponentProps } from "react";
import { Map, Marker, type Point } from "pigeon-maps";
import { maptiler } from "pigeon-maps/providers";

type LocationMapProps = {
  defaultCenter: Point;
  markers: ComponentProps<typeof Marker>[];
};

const maptilerProvider = maptiler(
  "q3gbdmFDPGft7ylWLC6u",
  "uk-openzoomstack-road",
);

export const LocationMap = ({ defaultCenter, markers }: LocationMapProps) => (
  <Map
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
  </Map>
);
