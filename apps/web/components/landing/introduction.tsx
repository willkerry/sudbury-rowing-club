import CommitteeSignature from "@/components/landing/committee-signature";
import Sponsors, { Affiliates } from "@/components/landing/sponsors";
import Container from "@/components/layouts/container";
import Text from "@/components/stour/text";
import type { PortableTextProps } from "@portabletext/react";

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
