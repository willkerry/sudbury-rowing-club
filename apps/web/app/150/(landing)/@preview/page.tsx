import { HundredAndFiftyGallery } from "@/components/anniversary/150-gallery";
import { fetchArchives } from "@sudburyrc/api";

const PreviewGallery = async () => (
  <HundredAndFiftyGallery archives={await fetchArchives()} />
);

export default PreviewGallery;
