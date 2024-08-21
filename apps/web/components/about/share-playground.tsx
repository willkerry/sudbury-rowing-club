"use client";

import { useRef } from "react";
import { useClipboard } from "@mantine/hooks";
import { toast } from "sonner";
import { makeShareImageURL } from "@/lib/og-image";
import Loading from "@/components/stour/loading";
import { Button } from "@/components/ui/button";
import { type ShareImage } from "@/app/api/og/route";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

const DEFAULT_TITLE = "Share Image Playground 🎉";
const DEFAULT_SUBTITLE = new Date().toLocaleDateString("en-GB", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
const DEFAULT_VARIANT = "blue";

const SharePlayground = () => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);
  const variantInputRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const { copy, error } = useClipboard();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!titleInputRef.current) return;
    if (!subtitleInputRef.current) return;
    if (!variantInputRef.current) return;
    if (!imageRef.current) return;
    if (!loadingRef.current) return;

    const title = titleInputRef.current.value;
    const subtitle = subtitleInputRef.current.value;
    const variant = variantInputRef.current.value as ShareImage["variant"];

    imageRef.current.removeAttribute("src");
    imageRef.current.removeAttribute("alt");

    loadingRef.current.classList.remove("hidden");
    loadingRef.current.classList.add("flex");

    imageRef.current.alt = `Share image with title "${titleInputRef.current?.value}" and subtitle "${subtitleInputRef.current?.value}"`;
    imageRef.current.src = makeShareImageURL(title, true, {
      subtitle,
      variant,
    });

    imageRef.current.addEventListener("load", () => {
      loadingRef.current?.classList.add("hidden");
    });
  };

  return (
    <form
      className="grid grid-cols-1 items-end gap-3 pb-12 pt-4 md:grid-cols-2"
      onSubmit={onSubmit}
    >
      <Input
        name="title"
        ref={titleInputRef}
        defaultValue={DEFAULT_TITLE}
        label="Title"
      />

      <Input
        name="subtitle"
        ref={subtitleInputRef}
        defaultValue={DEFAULT_SUBTITLE}
        label="Subtitle"
        required={false}
      />

      <Select
        name="variant"
        ref={variantInputRef}
        defaultValue="blue"
        label="Variant"
      >
        <option value="blue">Blue</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </Select>

      <Button type="submit">Generate</Button>

      <div className="aspect-h-8 aspect-w-16 relative mt-6 overflow-hidden rounded-lg border bg-gray-100 md:col-span-2">
        <div
          className="absolute inset-0 hidden items-center justify-center"
          ref={loadingRef}
        >
          <Loading />
        </div>

        <img
          src={makeShareImageURL(DEFAULT_TITLE, true, {
            subtitle: DEFAULT_SUBTITLE,
            variant: DEFAULT_VARIANT,
          })}
          ref={imageRef}
          alt="Placeholder for the generated share picture. This one is blue, features the title 'Share Image Playground 🎉' and the subtitle 'Monday, 1 January 2000'."
        />
      </div>

      <div className="flex justify-end gap-1 md:col-span-2">
        {imageRef.current?.src && (
          <Button asChild size="sm" variant="secondary">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={imageRef.current?.src}
              download="share-image.png"
            >
              Download
            </a>
          </Button>
        )}

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

export default SharePlayground;
