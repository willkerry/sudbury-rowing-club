import type React from "react";
import { Container } from "@/components/layouts/container";
import { HourlyForecast } from "@/components/safety/hourly-forecast";
import { PageHeader } from "@/components/stour/hero/page-header";

const SafetyLayout = async ({
  children,
  status,
}: {
  children: React.ReactNode;
  status: React.ReactNode;
}) => (
  <>
    <PageHeader prose title="Safety" />

    <Container className="mx-auto mt-6 max-w-prose sm:mt-12">
      <div className="overflow-hidden rounded-sm border">{status}</div>
    </Container>

    <Container className="mx-auto mt-4">
      <HourlyForecast />
    </Container>

    <Container className="mx-auto my-6 max-w-prose space-y-16 sm:my-12">
      {children}
    </Container>
  </>
);

export default SafetyLayout;
