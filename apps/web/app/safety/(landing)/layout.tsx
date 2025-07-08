import { Container } from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import type React from "react";

const SafetyLayout = async ({
  children,
  status,
}: {
  children: React.ReactNode;
  status: React.ReactNode;
}) => (
  <>
    <PageHeader prose title="Safety" />

    <Container className="mx-auto my-6 max-w-prose space-y-16 sm:my-12">
      <div className="overflow-hidden rounded-sm border">{status}</div>
      {children}
    </Container>
  </>
);

export default SafetyLayout;
