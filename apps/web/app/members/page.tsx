import { fetchNotices } from "@sudburyrc/api";
import { createMetaData } from "@/lib/create-metadata";
import Container from "@/components/layouts/container";
import CollapsibleCard from "@/components/stour/collapsible-card";
import HeroTitle from "@/components/stour/hero/hero-title";

export const revalidate = 60;

export const metadata = createMetaData({
  title: "Members’ Notices",
  description: "Notices for members of Sudbury Rowing Club.",
  image: { title: "Members’ Notices 📢" },
});

const Notices = async () => {
  const notices = await fetchNotices();

  return (
    <>
      <HeroTitle prose title="Notices" transparent />
      <Container className="my-12 max-w-prose space-y-6">
        {notices.map((notice) => (
          <CollapsibleCard key={notice._id} {...{ notice }} />
        ))}
      </Container>
    </>
  );
};

export default Notices;
