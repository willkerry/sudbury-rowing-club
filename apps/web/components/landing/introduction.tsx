import dynamic from "next/dynamic";
import { PortableTextProps } from "@portabletext/react";
import { Affiliates } from "@/components/landing/sponsors";
import Container from "@/components/layouts/container";
import Text from "@/components/stour/text";

const CommitteeSignature = dynamic(
  () => import("@/components/landing/committee-signature"),
);
const Sponsors = dynamic(() => import("@/components/landing/sponsors"));

type IntroductionProps = {
  description: PortableTextProps["value"];
};

const Introduction = ({ description }: IntroductionProps) => (
  <section id="intro">
    <Container className="my-16">
      <div className="mx-auto my-16">
        <Text portableText={description} className="mx-auto my-16" />
        <span className="sr-only">The Committee</span>
        <CommitteeSignature aria-hidden className="mx-auto w-48" />
        <Affiliates />
      </div>
      <Sponsors heading="Sponsored by" className="mb-24" />
    </Container>
  </section>
);
export default Introduction;
