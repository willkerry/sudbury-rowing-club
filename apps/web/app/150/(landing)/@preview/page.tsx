import { fetchArchives } from "@sudburyrc/api";
import { HundredAndFiftyGallery } from "@/components/anniversary/150-gallery";

const PreviewGallery = async () => (
  <HundredAndFiftyGallery archives={await fetchArchives()} />
);

export default PreviewGallery;
