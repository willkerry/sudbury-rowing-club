import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Button from "@/components/stour/button";
import { Home, Search } from "react-feather";
import Link from "@/components/stour/link";

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Notices</title>
      </Head>
      <HeroTitle prose title="Notices" transparent />

      <Container className="mt-12 max-w-prose">
        <div className="border divide-y rounded">
          <h2 className="p-4 text-sm font-medium tracking-wide text-gray-600 uppercase">
            Officer Nominations
          </h2>
          <p className="p-4">
            The following officers nominations have been submitted ahead of the
            2021 AGM. Further nominations should be submitted to the secretary.
          </p>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col">
              <h3 className="font-medium text-gray-700">
                Nominations for Chairman
              </h3>
              <Link href="" download>
                Name Name
              </Link>
              <Link href="" download>
                Name Name
              </Link>
            </div>
            <div className="flex flex-col">
              <h3 className="font-medium text-gray-700">
                Nominations for Captain
              </h3>
              <Link href="" download>
                Name Name
              </Link>
              <Link href="" download>
                Name Name
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
