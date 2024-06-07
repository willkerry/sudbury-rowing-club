import { fetchNotices } from "@sudburyrc/api";
// import { makeShareImageURL } from "@/lib/og-image";
import Container from "@/components/layouts/container";
import CollapsibleCard from "@/components/stour/collapsible-card";
import HeroTitle from "@/components/stour/hero/hero-title";

export const revalidate = 60;

const Notices = async () => {
  const notices = await fetchNotices();

  return (
    <>
      {/* <NextSeo
        title="Members’ Notices"
        description="Notices for members of Stour Rowing Club."
        openGraph={{
          title: "Competition Calendar",
          description: "Notices for members of Stour Rowing Club.",
          images: [{ url: makeShareImageURL("Members’ Notices 📢, true") }],
        }}
      /> */}

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
