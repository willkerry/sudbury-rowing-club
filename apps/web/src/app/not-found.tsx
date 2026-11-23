import { IconHome } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import TroubleAtTMill from "@/assets/error/trouble-at-tmill.jpg";
import { Container } from "@/components/layouts/container";
import { SiteSearch } from "@/components/search";
import { PageHeader } from "@/components/stour/hero/page-header";
import { Button } from "@/components/ui/button";
import { Track404 } from "@/components/utils/track-404";

export const metadata: Metadata = {
  title: "Page not found",
};

const Custom404 = () => (
  <>
    <Suspense fallback={null}>
      <Track404 />
    </Suspense>

    <PageHeader prose title="Page not found" />

    <div className="flex justify-center">
      <Image
        alt="The cut beside the boathouse drained to mud, with the landing stage and a launch on the riverbed."
        className="rounded-xs"
        height={144}
        src={TroubleAtTMill}
        width={192}
      />
    </div>

    <Container className="prose mt-12 max-w-prose">
      <p>
        We could not find this page. It may have moved or been removed. Try
        searching, or return to the homepage.
      </p>
      <div className="flex flex-col gap-4">
        <SiteSearch />

        <Button asChild icon={<IconHome />} variant="secondary">
          <Link href="/">Return to the homepage</Link>
        </Button>
      </div>
    </Container>
  </>
);

export default Custom404;
