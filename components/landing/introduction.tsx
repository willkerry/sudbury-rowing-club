import Container from "@/components/layouts/container";
import Text from "@/components/stour/text";
import { PortableTextProps } from "@portabletext/react";
import dynamic from "next/dynamic";

const CommitteeSignature = dynamic(
  () => import("@/components/landing/committee-signature")
);
const Sponsors = dynamic(() => import("@/components/landing/sponsors"));

type IntroductionProps = {
  description: PortableTextProps["value"];
};

const Introduction = ({ description }: IntroductionProps) => (
  <section id="intro">
    <Container className="my-16">
      <div className="mx-auto ">
        <Text portableText={description} className="mx-auto" />
        <CommitteeSignature className="w-48 py-16 mx-auto" />
        <span className="sr-only">The Committee</span>
      </div>
      <Sponsors />
    </Container>
  </section>
);
export default Introduction;
