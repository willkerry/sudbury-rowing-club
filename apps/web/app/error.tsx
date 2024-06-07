"use client";

import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import TroubleAtTMill from "public/assets/error/trouble-at-tmill.jpg";
import Container from "@/components/layouts/container";
import { SiteSearch } from "@/components/search";
import { HeroTitle } from "@/components/stour/hero";
import { Button } from "@/components/ui/button";
import { Error } from "@/components/ui/error";

export default function SafetyError({ error }: { error: Error }) {
  return (
    <>
      <HeroTitle prose title="Something went wrong." transparent />

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

        <Error error={error} label={error.name}>
          <pre className="overflow-hidden rounded bg-red-50 p-2 text-red-600">
            <code>{error.stack}</code>
          </pre>
        </Error>
      </Container>
    </>
  );
}
