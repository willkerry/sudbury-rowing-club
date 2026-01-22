import { SharePlayground } from "@/components/about/share-playground";
import TextPage from "@/components/layouts/text-page";
import { createMetadata } from "@/lib/create-metadata";

export const title = "Share image generator";
export const description =
  "Generate OpenGraph images for sharing on social media.";
export const image = { title: "Share image generator 🖼️" };

export const metadata = createMetadata({
  title,
  description,
  image,
});

const ShareImage = () => (
  <TextPage title={title} description={description} prose="max-w-prose">
    <SharePlayground />
  </TextPage>
);

export default ShareImage;
