import { InferGetStaticPropsType, NextPage } from "next";
import { NextSeo } from "next-seo";
import { fetchGovernance } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import {
  Committees,
  Documents,
  NonExec,
  Officers,
} from "@/components/governance";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import HeroTitle from "@/components/stour/hero/hero-title";

export const getStaticProps = async () => ({ props: await fetchGovernance() });

const Governance: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  officers,
  committees,
  vicePresidents,
  trustees,
  documents,
}) => (
  <Layout>
    <NextSeo
      openGraph={{
        images: [{ url: makeShareImageURL("Governance", true) }],
        title: "Governance",
      }}
      title="Governance"
    />
    <HeroTitle prose title="Governance" />
    <Container className="my-16">
      <Officers officers={officers} />
      <Committees committees={committees} />
      <NonExec trustees={trustees} vicePresidents={vicePresidents} />
      <Documents documents={documents} />
    </Container>
  </Layout>
);

export default Governance;
