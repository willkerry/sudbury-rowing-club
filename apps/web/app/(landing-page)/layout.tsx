import { HundredAndFiftyCta } from "@/components/anniversary/150-cta";
import { LandingCTA } from "@/components/landing";
import Container from "@/components/layouts/container";

const LandingPageLayout = ({
  britishRowingFeed,
  children,
  gallery,
  hero,
  introduction,
  news,
  notice,
}: {
  britishRowingFeed: React.ReactNode;
  children: React.ReactNode;
  gallery: React.ReactNode;
  hero: React.ReactNode;
  introduction: React.ReactNode;
  news: React.ReactNode;
  notice: React.ReactNode;
}) => (
  <>
    {notice}

    <Container>{hero}</Container>

    <Container>
      <LandingCTA />
    </Container>

    <section id="intro">
      <Container className="my-16">{introduction}</Container>
    </section>

    <div className="mx-auto max-w-7xl px-4 pb-20">
      <HundredAndFiftyCta />
    </div>

    {gallery}

    <section className="my-16">
      <Container>{news}</Container>
    </section>

    {children}
    <Container>{britishRowingFeed}</Container>
  </>
);

export default LandingPageLayout;
