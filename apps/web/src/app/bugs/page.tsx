import { Suspense } from "react";
import { Container } from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import { createMetadata } from "@/lib/create-metadata";
import { BugsClientSide } from "./client-page";

export const metadata = createMetadata({
  description: "Report a bug",
  image: { title: "Report a bug 💩" },
  title: "Report a bug | Sudbury Rowing Club",
});

const BugsPage = () => (
  <>
    <PageHeader breadcrumbs title="Report a bug 💩" />
    <Container className="max-w-lg pt-6 pb-12 sm:pt-12">
      <Suspense fallback={<div>Loading...</div>}>
        <BugsClientSide />
      </Suspense>
    </Container>
  </>
);

export default BugsPage;
