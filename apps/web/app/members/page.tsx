import { getTranslations } from "next-intl/server";
import Container from "@/components/layouts/container";
import CollapsibleCard from "@/components/stour/collapsible-card";
import HeroTitle from "@/components/stour/hero/hero-title";
import { createMetadata } from "@/lib/create-metadata";
import { fetchNotices } from "@sudburyrc/api";

export const revalidate = 60;

export const metadata = createMetadata({
  title: "Members’ Notices",
  description: "Notices for members of Sudbury Rowing Club.",
  image: { title: "Members’ Notices 📢" },
});

const Notices = async () => {
const t = await getTranslations("members");

  const notices = await fetchNotices();

  return (
    <>
      <HeroTitle prose title={t('notices')} transparent />
      <Container className="my-12 max-w-prose space-y-6">
        {notices.map((notice) => (
          <CollapsibleCard key={notice._id} {...{ notice }} />
        ))}
      </Container>
    </>
  );
};

export default Notices;
