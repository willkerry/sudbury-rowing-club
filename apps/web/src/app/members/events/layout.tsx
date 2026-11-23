import { Container } from "@/components/layouts/container";
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
    <Container className="pb-12">
      {children}
      {calendar}
    </Container>
  </>
);

export default EventsLayout;
