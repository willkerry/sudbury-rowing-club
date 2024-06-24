import type { Metadata } from "next";
import { fetchGovernance } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import {
  Committees,
  Documents,
  NonExec,
  Officers,
} from "@/components/governance";
import Container from "@/components/layouts/container";
import { HeroTitle } from "@/components/stour/hero";

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
      <HeroTitle prose title="Governance" />
      <Container className="my-16">
        <Officers officers={officers} />
        <Committees committees={committees} />
        <NonExec trustees={trustees} vicePresidents={vicePresidents} />
        <Documents documents={documents} />
      </Container>
    </>
  );
};

export default Governance;
