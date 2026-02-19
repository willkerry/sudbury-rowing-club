"use client";

import { useClipboard } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ShareImage } from "@/app/api/og/route";
import { Loading } from "@/components/stour/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { makeShareImageURL } from "@/lib/og-image";
import { cn } from "@/lib/utils";

const DEFAULT_TITLE = "Share Image Playground 🎉";
const DEFAULT_SUBTITLE = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});

export const SharePlayground = () => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);
  const variantInputRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const { copy, error } = useClipboard();

  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const handleGenerateImageAndPutIntoImg = useCallback(() => {
    if (!titleInputRef.current) return;
    if (!subtitleInputRef.current) return;
    if (!variantInputRef.current) return;

    if (!imageRef.current) return;

    const title = titleInputRef.current.value;
    const subtitle = subtitleInputRef.current.value;
    const variant = variantInputRef.current.value as ShareImage["variant"];

    const imageUrl = makeShareImageURL(title, true, {
      subtitle,
      variant,
    });

    setState("loading");

    const image = imageRef.current;
    image.src = imageUrl;

    image.onload = () => {
      setState("success");
    };

    image.onerror = () => {
      setState("error");
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleGenerateImageAndPutIntoImg();
  };

  useEffect(() => {
    handleGenerateImageAndPutIntoImg();
  }, [handleGenerateImageAndPutIntoImg]);

  return (
    <form
      className="grid grid-cols-1 items-end gap-3 pt-4 pb-12 md:grid-cols-2"
      onSubmit={onSubmit}
    >
      <Input
        defaultValue={DEFAULT_TITLE}
        disabled={state === "loading"}
        label="Title"
        name="title"
        ref={titleInputRef}
      />

      <Input
        defaultValue={DEFAULT_SUBTITLE}
        disabled={state === "loading"}
        label="Subtitle"
        name="subtitle"
        ref={subtitleInputRef}
        required={false}
      />

      <Select
        defaultValue="blue"
        disabled={state === "loading"}
        label="Variant"
        name="variant"
        ref={variantInputRef}
      >
        <option value="blue">Blue</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </Select>

      <Button loading={state === "loading"} type="submit">
        Generate
      </Button>

      <div className="relative mt-6 aspect-h-8 aspect-w-16 overflow-hidden rounded-lg border bg-gray-100 md:col-span-2">
        <div
          className={cn({
            "absolute inset-0 z-10 items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm":
              state === "loading",
            hidden: state !== "loading",
          })}
        >
          <Loading />
        </div>

        <img alt="" ref={imageRef} suppressHydrationWarning />
      </div>

      <div className="flex justify-end gap-1 md:col-span-2">
        <Button asChild size="sm" variant="secondary">
          <a
            download="share-image.png"
            href={imageRef.current?.src}
            rel="noopener noreferrer"
            target="_blank"
          >
            Download
          </a>
        </Button>

        <Button
          onClick={() => {
            copy(imageRef.current?.src);

            if (error) {
              toast.error("Failed to copy URL to clipboard");
              return;
            }

            toast.success("URL copied to clipboard");
          }}
          size="sm"
          variant="ghost"
        >
          Copy URL
        </Button>
      </div>
    </form>
  );
};
