import Label from "@/components/stour/label";
import Loading from "@/components/stour/loading";
import { Button } from "@/components/ui/button";
import { makeShareImageURL } from "@/lib/og-image";
import type { ShareImage } from "@/pages/api/og";
import { useClipboard } from "@mantine/hooks";
import { useRef } from "react";
import { toast } from "sonner";

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
      className="grid grid-cols-1 items-end gap-3 pt-4 pb-12 md:grid-cols-2"
      onSubmit={onSubmit}
    >
      <label htmlFor="title">
        <Label>Title</Label>
        <input
          type="text"
          name="title"
          id="title"
          ref={titleInputRef}
          defaultValue={DEFAULT_TITLE}
        />
      </label>

      <label htmlFor="subtitle">
        <Label>Subtitle</Label>
        <input
          type="text"
          name="subtitle"
          ref={subtitleInputRef}
          defaultValue={DEFAULT_SUBTITLE}
        />
      </label>

      <label htmlFor="variant">
        <Label>Variant</Label>
        <select name="variant" ref={variantInputRef} defaultValue="blue">
          <option value="blue">Blue</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <Button type="submit">Generate</Button>

      <div className="relative mt-6 aspect-h-8 aspect-w-16 overflow-hidden rounded-lg border bg-gray-100 md:col-span-2">
        <div
          className="absolute inset-0 hidden items-center justify-center"
          ref={loadingRef}
        >
          <Loading />
        </div>

        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
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
