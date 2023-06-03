import Container from "@/components/layouts/container";
import Button from "@/components/stour/button";
import Link from "@/components/stour/link";

const LandingCTA = () => {
  const scrollToIntro = () => {
    const intro = document.getElementById("intro");
    const introTop = intro?.getBoundingClientRect().top;
    const offset = introTop ? introTop - 100 : 0;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };

  return (
    <Container>
      <div className="flex items-center justify-center space-x-3 pt-16 text-white">
        <Button shadow size="large" onClick={scrollToIntro}>
          Discover<span className="hidden sm:inline">&nbsp;more</span>
        </Button>
        <Button as={Link} href="/join" variant="secondary" shadow size="large">
          Join us
        </Button>
      </div>
    </Container>
  );
};

export default LandingCTA;
