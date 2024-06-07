import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";

const Governance = async ({ children }: { children: React.ReactNode }) => (
  <>
    <HeroTitle prose title="Governance" />
    <Container className="my-16">{children}</Container>
  </>
);

export default Governance;
