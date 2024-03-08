import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import { SiteSearch } from "@/components/search";
import HeroTitle from "@/components/stour/hero/hero-title";
import { Button } from "@/components/ui/button";

const Custom404 = () => (
  <Layout>
    <Head>
      <title>Error 404</title>
    </Head>
    <HeroTitle prose title="404 Page not found." transparent />

    <div className="flex justify-center">
      <Image
        alt="The time the river ran dry."
        className="rounded-sm"
        height={144}
        src="/assets/error/trouble-at-tmill.jpg"
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
  </Layout>
);

export default Custom404;
