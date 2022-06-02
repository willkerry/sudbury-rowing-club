import Container from "@/components/layouts/container";
import Button from "@/components/stour/button";
import Link from "@/components/stour/link";

const LandingCTA = () => (
  <Container>
    <div className="flex items-center justify-center pt-16 space-x-3 text-white">
      <Button as="a" href="#intro" shadow size="large">
        Discover<span className="hidden sm:inline">&nbsp;more</span>
      </Button>
      <Button as={Link} href="/join" variant="secondary" shadow size="large">
        Join us
      </Button>
    </div>
  </Container>
);

export default LandingCTA;
