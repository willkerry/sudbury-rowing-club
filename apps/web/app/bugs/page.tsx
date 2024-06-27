import { Suspense } from "react";
import { createMetadata } from "@/lib/create-metadata";
import Container from "@/components/layouts/container";
import { HeroTitle } from "@/components/stour/hero";
import { BugsClientSide } from "./client-page";

export const metadata = createMetadata({
  title: "Report a bug | Sudbury Rowing Club",
  description: "Report a bug",
  image: { title: "Report a bug 💩" },
});

const BugsPage = () => (
  <>
    <HeroTitle prose title="Report a bug 💩" color="transparent" />
    <Container className="max-w-lg pb-12 pt-6 sm:pt-12">
      <Suspense fallback={<div>Loading...</div>}>
        <BugsClientSide />
      </Suspense>
    </Container>
  </>
);

export default BugsPage;
