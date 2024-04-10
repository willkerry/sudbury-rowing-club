import { Archive } from "@sudburyrc/api";
import { Button } from "../ui/button";
import { HundredAndFiftyContactButton } from "./150-contact-button";

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
          rel="noreferrer"
          target="_blank"
        >
          View location
        </a>
      </Button>
    )}

    <Button asChild size="xs" variant="secondary">
      <a href={archive.image.url} rel="noreferrer" target="_blank" download>
        Download full size image
      </a>
    </Button>

    <HundredAndFiftyContactButton
      size="xs"
      variant="link"
      message={`I would like to help identify or date the photo '${archive.title}', (ID ${archive._id}).\n\nMy message: `}
    >
      Help identify this photo
    </HundredAndFiftyContactButton>
  </div>
);
