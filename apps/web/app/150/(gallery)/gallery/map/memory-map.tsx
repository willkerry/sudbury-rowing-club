"use client";

import * as maptilersdk from "@maptiler/sdk";
import { CLUB_LOCATION } from "@/lib/constants";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useEffect, useRef } from "react";
import { env } from "@/env";

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

    maptilersdk.config.apiKey = env.NEXT_PUBLIC_MAPTILER_KEY;

    map.current = new maptilersdk.Map({
      center: [CLUB_LOCATION[1], CLUB_LOCATION[0]],
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      zoom: 12,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      map.current.addSource("memories", {
        type: "geojson",
        data: {
          features: locations.map((loc) => ({
            type: "Feature",
            geometry: {
              coordinates: loc.coordinates,
              type: "Point",
            },
            properties: {
              weight: loc.weight,
            },
          })),
          type: "FeatureCollection",
        },
      });

      map.current.addLayer({
        id: "memories-heat",
        source: "memories",
        type: "heatmap",
        paint: {
          "heatmap-opacity": 0.8,
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 15, 50],
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
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            15,
            3,
          ],
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "weight"],
            0,
            0,
            1,
            1,
          ],
        },
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [locations]);

  return (
    <div className="h-full w-full touch-manipulation" ref={mapContainer} />
  );
};
