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
    bg: blue[900],
    mg: blue[200],
    fg: "#fff",
    g1: "#a1c4fd",
    g2: "#c2e9fb",
    weight: 600,
    spacing: -1,
  },
  dark: {
    bg: "#000",
    mg: "rgba(255, 255, 255, 0.5)",
    fg: "rgba(255, 255, 255, 0.8)",
    g1: "#fff",
    g2: "#fff",
    weight: 500,
    spacing: -2,
  },
  light: {
    bg: "#fff",
    mg: "rgba(0, 0, 0, 0.5)",
    fg: "rgba(0, 0, 0, 0.8)",
    g1: "#000",
    g2: "#000",
    weight: 500,
    spacing: -2,
  },
};

export const variantsList = Object.keys(variants) as ShareImage["variant"][];
