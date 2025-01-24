import { getTranslations } from "next-intl/server";
import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import Container from "@/components/layouts/container";

const Archive = async ({ children }: { children: React.ReactNode }) =>  {
const t = await getTranslations("150/(gallery)/gallery/[slug]");

return (
  <>
    <HundredAndFiftyHeader title={t('archive-resource')} href="/150/gallery" />

    <Container>{children}</Container>
  </>
)
};

export default Archive;
