"use client";

import { Crest, Social, Wordmark } from "@sudburyrc/blue";
import type { JSX, SVGProps } from "react";
import { BrandAsset } from "./brand-asset";

export type BrandAssetType = {
  name: string;
  Illustration: (
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
  ) => JSX.Element;
  color: string;
  description: string;
  downloads: (
    | {
        format: "svg";
        width?: undefined;
      }
    | {
        format: "png";
        width: number;
      }
  )[];
};

const brandAssets: BrandAssetType[] = [
  {
    Illustration: Crest,
    color: "#002147",
    description: "the club crest",
    downloads: [
      { format: "svg" },
      { format: "png", width: 1280 },
      { format: "png", width: 640 },
    ],
    name: "Crest",
  },
  {
    Illustration: Crest,
    color: "#FFF",
    description: "the club crest in white",
    downloads: [
      { format: "svg" },
      { format: "png", width: 1280 },
      { format: "png", width: 640 },
    ],
    name: "Crest in white",
  },
  {
    Illustration: Wordmark,
    color: "#002147",
    description: "a composited logo that contains both crest and wordmark.",
    downloads: [
      { format: "svg" },
      { format: "png", width: 2560 },
      { format: "png", width: 1280 },
    ],
    name: "Lockup",
  },
  {
    Illustration: Wordmark,
    color: "#FFF",
    description: "a composited logo that contains both crest and wordmark.",
    downloads: [
      { format: "svg" },
      { format: "png", width: 2560 },
      { format: "png", width: 1280 },
    ],
    name: "Lockup in white",
  },
  {
    Illustration: Social,
    color: "Gradient",
    description:
      "A square image with a background, for use on platforms that require profile pictures.",
    downloads: [{ format: "svg" }, { format: "png", width: 1024 }],
    name: "Social",
  },
];

export const BrandAssets = () => (
  <>
    {brandAssets.map((item) => (
      <BrandAsset key={item.name} {...item} />
    ))}
  </>
);
