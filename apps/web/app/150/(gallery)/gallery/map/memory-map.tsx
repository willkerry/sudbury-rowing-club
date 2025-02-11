"use client";

import { CLUB_LOCATION } from "@/lib/constants";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useEffect, useRef } from "react";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

if (!MAPTILER_KEY) {
  throw new Error("MAPTILER_KEY is not set");
}

type Location = {
  coordinates: [number, number];
  weight: number;
};

type MemoryMapProps = {
  locations: Location[];
};

export const MemoryMap = ({ locations }: MemoryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    maptilersdk.config.apiKey = MAPTILER_KEY;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [CLUB_LOCATION[1], CLUB_LOCATION[0]],
      zoom: 12,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      map.current.addSource("memories", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: locations.map((loc) => ({
            type: "Feature",
            properties: {
              weight: loc.weight,
            },
            geometry: {
              type: "Point",
              coordinates: loc.coordinates,
            },
          })),
        },
      });

      map.current.addLayer({
        id: "memories-heat",
        type: "heatmap",
        source: "memories",
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "weight"],
            0,
            0,
            1,
            1,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            15,
            3,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,255,0)",
            0.2,
            "rgb(0,0,255)",
            0.4,
            "rgb(0,255,255)",
            0.6,
            "rgb(0,255,0)",
            0.8,
            "rgb(255,255,0)",
            1,
            "rgb(255,0,0)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 15, 50],
          "heatmap-opacity": 0.8,
        },
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [locations]);

  return <div ref={mapContainer} className="h-full w-full" />;
};
