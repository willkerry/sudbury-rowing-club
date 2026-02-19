import { blue } from "@sudburyrc/blue";
import type { ShareImage } from "./route";

export const variants: Record<
  ShareImage["variant"],
  {
    bg: string;
    mg: string;
    fg: string;
    g1: string;
    g2: string;
    weight: 500 | 600;
    spacing: number;
  }
> = {
  blue: {
    bg: blue[950],
    fg: "#fff",
    g1: "#a1c4fd",
    g2: "#c2e9fb",
    mg: blue[200],
    spacing: -1,
    weight: 600,
  },
  dark: {
    bg: "#000",
    fg: "rgba(255, 255, 255, 0.8)",
    g1: "#fff",
    g2: "#fff",
    mg: "rgba(255, 255, 255, 0.5)",
    spacing: -2,
    weight: 500,
  },
  light: {
    bg: "#fff",
    fg: "rgba(0, 0, 0, 0.8)",
    g1: "#000",
    g2: "#000",
    mg: "rgba(0, 0, 0, 0.5)",
    spacing: -2,
    weight: 500,
  },
};

export const variantsList = Object.keys(variants) as ShareImage["variant"][];
