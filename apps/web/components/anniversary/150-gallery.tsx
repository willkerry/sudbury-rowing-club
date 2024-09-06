import { formatYear } from "@/app/150/(gallery)/gallery/page";
import Gallery from "@/components/regatta/landing-page/gallery";
import type { Archive } from "@sudburyrc/api";

const appendAFullStop = (str: string) => {
  const trimmed = str.trim();

  if (trimmed.endsWith(".")) {
    return trimmed;
  }

  return `${trimmed}.`;
};

const stripTrailingPunctuation = (str: string) => str.replace(/[.,;:!?]+$/, "");

const shortenDescription = (description?: string | null) => {
  if (!description) return "";

  if (description.length > 127) {
    return `${stripTrailingPunctuation(description.substring(0, 127))}…`;
  }

  return appendAFullStop(description);
};

const formatDescriptionOrYear = (
  description: string | null,
  year: string | null,
  range: number | null,
) => (description ? shortenDescription(description) : formatYear(year, range));

export const HundredAndFiftyGallery = ({
  archives,
}: {
  archives: Archive[];
}) => (
  <Gallery
    images={archives
      ?.filter((archive) => archive.year || archive.description)
      .map((archive) => ({
        _id: archive.image._id,
        aspectRatio: archive.image.aspectRatio,
        caption: formatDescriptionOrYear(
          archive.description,
          archive.year,
          archive.range,
        ),
        lqip: archive.image.lqip,
        href: `/150/gallery/${archive._id}`,
        url: archive.image.url,
      }))}
  />
);
