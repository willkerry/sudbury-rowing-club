import {
  Committees,
  Documents,
  NonExec,
  Officers,
} from "@/components/governance";
import Container from "@/components/layouts/container";
import { HeroTitle } from "@/components/stour/hero";
import { makeShareImageURL } from "@/lib/og-image";
import { fetchGovernance } from "@sudburyrc/api";
import type { Metadata } from "next";

const title = "Governance";
const description = "How is Sudbury Rowing Club run?";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: makeShareImageURL("Governance", true) }],
  },
};

const Governance = async () => {
  const { officers, committees, vicePresidents, trustees, documents } =
    await fetchGovernance();

  return (
    <>
      <HeroTitle breadcrumbs title="Governance" />
      <Container className="mt-4 mb-16 sm:my-16">
        <Officers officers={officers} />
        <Committees committees={committees} />
        <NonExec trustees={trustees} vicePresidents={vicePresidents} />
        <Documents documents={documents} />
      </Container>
    </>
  );
};

export default Governance;
