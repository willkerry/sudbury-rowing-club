import Container from "@/components/layouts/container";
import { HeroTitle } from "@/components/stour/hero";

const EventsLayout = ({
  children,
  calendar,
}: {
  children: React.ReactNode;
  calendar: React.ReactNode;
}) => (
  <>
    <HeroTitle prose title="Competition Calendar" transparent />
    <Container>{children}</Container>
    <Container>{calendar}</Container>

    <div className="mt-4" />
  </>
);

export default EventsLayout;
