import { fetchNotices } from "@sudburyrc/api";
import { Container } from "@/components/layouts/container";
import { CollapsibleCard } from "@/components/stour/collapsible-card";
import { PageHeader } from "@/components/stour/hero/page-header";
import { createMetadata } from "@/lib/create-metadata";
import { NoticeBody } from "./notice-body";

export const metadata = createMetadata({
  title: "Members’ Notices",
  description: "Notices for members of Sudbury Rowing Club.",
  image: { title: "Members’ Notices 📢" },
});

const Notices = async () => {
  const notices = await fetchNotices();

  return (
    <>
      <PageHeader prose title="Notices" />
      <Container className="my-12 max-w-prose space-y-6">
        {notices.map((notice) => (
          <CollapsibleCard key={notice._id} notice={notice}>
            <NoticeBody notice={notice} />
          </CollapsibleCard>
        ))}
      </Container>
    </>
  );
};

export default Notices;
