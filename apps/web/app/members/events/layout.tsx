import Container from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";

const EventsLayout = ({
  children,
  calendar,
}: {
  children: React.ReactNode;
  calendar: React.ReactNode;
}) => (
  <>
    <PageHeader breadcrumbs title="Competition Calendar" />
    <Container>{children}</Container>
    <Container>{calendar}</Container>

    <div className="mt-4" />
  </>
);

export default EventsLayout;
