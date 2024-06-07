import { fetchArchives } from "@sudburyrc/api";
import { HundredAndFiftyGallery } from "@/components/anniversary/150-gallery";

const PreviewGallery = async () => {
  const archives = await fetchArchives();

  return <HundredAndFiftyGallery archives={archives} />;
};

export default PreviewGallery;
