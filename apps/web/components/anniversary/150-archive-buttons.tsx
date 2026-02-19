import type { Archive } from "@sudburyrc/api";
import { HundredAndFiftyContactButton } from "@/components/anniversary/150-contact-button";
import { Button } from "@/components/ui/button";

const getGeohackURL = (lat: number, lng: number, title: string) => {
  const url = new URL("https://geohack.toolforge.org/geohack.php");

  url.searchParams.set("params", `${lat};${lng}_globe:earth_type:camera`);
  url.searchParams.set("title", title);

  return url.toString();
};

export const HundredAndFiftyArchiveButtons = ({
  archive,
}: {
  archive: Archive;
}) => (
  <div className="flex gap-2">
    {archive.location && (
      <Button asChild size="xs">
        <a
          href={getGeohackURL(
            archive.location?.lat || 0,
            archive.location?.lng || 0,
            archive.title,
          )}
          rel="noopener noreferrer"
          target="_blank"
        >
          View location
        </a>
      </Button>
    )}

    <Button asChild size="xs" variant="secondary">
      <a
        download
        href={archive.image.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        Download full size image
      </a>
    </Button>

    <HundredAndFiftyContactButton
      message={`I would like to help identify or date the photo '${archive.title}', (ID ${archive._id}).\n\nMy message: `}
      size="xs"
      variant="link"
    >
      Help identify this photo
    </HundredAndFiftyContactButton>
  </div>
);
