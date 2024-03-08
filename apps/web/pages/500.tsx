import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import { SiteSearch } from "@/components/search";
import HeroTitle from "@/components/stour/hero/hero-title";
import { Button } from "@/components/ui/button";

const Custom500 = () => (
  <Layout>
    <Head>
      <title>Error 500</title>
    </Head>

    <HeroTitle prose title="Something went wrong." transparent />

    <div className="flex justify-center">
      <Image
        alt="The time the river ran dry."
        className="rounded-lg"
        height={144}
        src="/assets/error/trouble-at-tmill.jpg"
        width={192}
      />
    </div>

    <Container className="prose mt-12 max-w-prose">
      <div className="flex flex-col gap-4">
        <SiteSearch />
        <Button asChild icon={<Home />} variant="secondary">
          <Link href="/">Return to the homepage</Link>
        </Button>
      </div>
      <div className="h-12" />

      <code>Error 500</code>
    </Container>
  </Layout>
);

export default Custom500;
