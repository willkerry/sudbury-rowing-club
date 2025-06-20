"use client";

import Container from "@/components/layouts/container";
import { SiteSearch } from "@/components/search";
import { PageHeader } from "@/components/stour/hero/page-header";
import { Button } from "@/components/ui/button";
import { Error as ErrorComponent } from "@/components/ui/error";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TroubleAtTMill from "public/assets/error/trouble-at-tmill.jpg";

export default function SafetyError({ error }: { error: Error }) {
  return (
    <>
      <PageHeader breadcrumbs title="Something went wrong." />

      <div className="flex justify-center">
        <Image
          alt="The time the river ran dry."
          className="rounded-lg"
          height={144}
          src={TroubleAtTMill}
          width={192}
        />
      </div>

      <Container className="prose mt-12 max-w-prose">
        <div className="flex flex-col gap-4">
          <SiteSearch />
          <Button asChild icon={<Home />} variant="secondary">
            <Link href="/">Return to the homepage</Link>
          </Button>
        </div>
        <div className="h-12" />

        <ErrorComponent error={error} label={error.name}>
          <pre className="rounded-sm bg-red-50 p-2 text-red-600 text-xs">
            <code>{error.stack}</code>
          </pre>
        </ErrorComponent>
      </Container>
    </>
  );
}
