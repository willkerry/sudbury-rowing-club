import Container from "@/components/layouts/container";

const LandingPageLayout = ({
  children,
  britishRowingFeed,
}: {
  children: React.ReactNode;
  britishRowingFeed: React.ReactNode;
}) => (
  <>
    {children}
    <Container>{britishRowingFeed}</Container>
  </>
);

export default LandingPageLayout;
