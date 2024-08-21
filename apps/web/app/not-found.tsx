import Container from "@/components/layouts/container";
import { SiteSearch } from "@/components/search";
import HeroTitle from "@/components/stour/hero/hero-title";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TroubleAtTMill from "public/assets/error/trouble-at-tmill.jpg";

export const metadata: Metadata = {
  title: "404 Page not found",
};

const Custom404 = () => (
  <>
    <HeroTitle prose title="404 Page not found." transparent />

    <div className="flex justify-center">
      <Image
        alt="The time the river ran dry."
        className="rounded-sm"
        height={144}
        src={TroubleAtTMill}
        width={192}
      />
    </div>

    <Container className="prose mt-12 max-w-prose">
      <p>
        The page you are looking for might have been removed, or might have just
        moved.
      </p>
      <div className="flex flex-col gap-4">
        <SiteSearch />

        <Button asChild icon={<Home />} variant="secondary">
          <Link href="/">Return to the homepage</Link>
        </Button>
      </div>
    </Container>
  </>
);

export default Custom404;
