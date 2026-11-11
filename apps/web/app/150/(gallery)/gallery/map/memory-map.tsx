"use client";

import dynamic from "next/dynamic";
import type { MemoryMapProps } from "./memory-map-impl";

const MemoryMapImpl = dynamic(() => import("./memory-map-impl"), {
  ssr: false,
});

export const MemoryMap = (props: MemoryMapProps) => (
  <MemoryMapImpl {...props} />
);
