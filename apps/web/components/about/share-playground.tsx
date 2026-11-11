"use client";

import { useDebouncedValue, useElementSize } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ShareImageCard } from "@/components/share-image/share-image-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
  type ShareImage,
} from "@/lib/share-image";

const DEFAULT_TITLE = "Share Image Playground 🎉";
const DEFAULT_SUBTITLE = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});
const RENDER_DEBOUNCE_MS = 300;

/**
 * Previews and downloads share images entirely in the browser. It never calls
 * the OG Worker, so experimenting here doesn't spend Browser Rendering time.
 */
export const SharePlayground = () => {
  const [image, setImage] = useState<ShareImage>({
    subtitle: DEFAULT_SUBTITLE,
    title: DEFAULT_TITLE,
    variant: "blue",
  });
  const [debouncedImage] = useDebouncedValue(image, RENDER_DEBOUNCE_MS);
  const [pngUrl, setPngUrl] = useState<string>();

  const { ref: previewRef, width: previewWidth } = useElementSize();
  const cardRef = useRef<HTMLDivElement>(null);

  // Render the PNG ahead of time, so Download is a plain link the user clicks.
  // Browsers drop downloads started from script after an await, because the
  // click's user activation has expired by then.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-render the PNG when the debounced image changes
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let url: string | undefined;
    let cancelled = false;

    setPngUrl(undefined);

    import("html-to-image")
      .then(({ toBlob }) =>
        toBlob(card, {
          height: SHARE_IMAGE_HEIGHT,
          pixelRatio: 1,
          width: SHARE_IMAGE_WIDTH,
        }),
      )
      .then((blob) => {
        if (cancelled || !blob) return;

        url = URL.createObjectURL(blob);
        setPngUrl(url);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to create the image");
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [debouncedImage]);

  return (
    <div className="grid grid-cols-1 items-end gap-3 pt-4 pb-12 md:grid-cols-2">
      <Input
        label="Title"
        name="title"
        onChange={(event) => setImage({ ...image, title: event.target.value })}
        value={image.title}
      />

      <Input
        label="Subtitle"
        name="subtitle"
        onChange={(event) =>
          setImage({ ...image, subtitle: event.target.value })
        }
        required={false}
        value={image.subtitle}
      />

      <Select
        label="Variant"
        name="variant"
        onChange={(event) =>
          setImage({
            ...image,
            variant: event.target.value as ShareImage["variant"],
          })
        }
        value={image.variant}
      >
        <option value="blue">Blue</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </Select>

      <div
        className="relative mt-6 aspect-2/1 overflow-hidden rounded-lg border bg-gray-100 md:col-span-2"
        ref={previewRef}
      >
        <div
          aria-hidden
          className="origin-top-left"
          style={{ transform: `scale(${previewWidth / SHARE_IMAGE_WIDTH})` }}
        >
          <div ref={cardRef}>
            <ShareImageCard {...image} />
          </div>
        </div>
      </div>

      <div className="flex justify-end md:col-span-2">
        {pngUrl && image === debouncedImage ? (
          <Button asChild size="sm" variant="secondary">
            <a download="share-image.png" href={pngUrl}>
              Download
            </a>
          </Button>
        ) : (
          <Button disabled loading size="sm" variant="secondary">
            Download
          </Button>
        )}
      </div>
    </div>
  );
};
