import React from "react";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";

const SafetyLayout = async ({
  children,
  status,
}: {
  children: React.ReactNode;
  status: React.ReactNode;
}) => (
  <>
    <HeroTitle prose title="Safety" color="transparent" />

    <Container className="mx-auto my-12 max-w-prose space-y-16">
      <div className="overflow-hidden rounded border">{status}</div>
      {children}
    </Container>
  </>
);

export default SafetyLayout;
