import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShareImageCard } from "@/components/share-image/share-image-card";
import {
  parseShareImageParams,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
} from "@/lib/share-image";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Share image template",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * The OG Worker (apps/og) loads this page in a headless browser, swaps the
 * body for the contents of the `<template>`, and screenshots it. The design
 * stays inert and invisible to anyone who opens the page directly.
 */
const OgTemplatePage = async ({ searchParams }: Props) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }

  const image = parseShareImageParams(params);
  if (!image) notFound();

  return (
    <template
      data-og-height={SHARE_IMAGE_HEIGHT}
      data-og-template
      data-og-width={SHARE_IMAGE_WIDTH}
    >
      <ShareImageCard {...image} />
    </template>
  );
};

export default OgTemplatePage;
