import { Archive } from "@sudburyrc/api";
import Gallery from "@/components/regatta/landing-page/gallery";
import { formatYear } from "@/pages/150/gallery";

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
        aspectRatio: archive.image.metadata.dimensions.aspectRatio,
        caption: formatDescriptionOrYear(
          archive.description,
          archive.year,
          archive.range,
        ),
        lqip: archive.image.metadata.lqip,
      }))}
  />
);
