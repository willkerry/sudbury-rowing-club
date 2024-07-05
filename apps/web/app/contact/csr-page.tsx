"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import { useQuery } from "@tanstack/react-query";
import { fetchOfficerNames } from "@sudburyrc/api";
import { browserIndexOfficers } from "@/lib/algolia";
import ContactForm from "@/components/contact";
import type { Message } from "@/components/contact/contactForm";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Loading from "@/components/stour/loading";

const ContactPage = ({
  officers,
}: {
  officers: Awaited<ReturnType<typeof fetchOfficerNames>>;
}) => {
  const searchParams = useSearchParams();

  const q = searchParams?.get("q");
  const initialValues: Partial<Message> = {
    to: searchParams?.get("to") ?? undefined,
    name: searchParams?.get("name") ?? undefined,
    email: searchParams?.get("email") ?? undefined,
    message: searchParams?.get("message") ?? undefined,
  };

  const { data: guessedRecipient } = useQuery({
    queryKey: ["officers", q],
    queryFn: () =>
      browserIndexOfficers
        .search<(typeof officers)[number]>(q ?? "")
        .then((r) => r.hits[0]),
    enabled: !!q,
    staleTime: Infinity,
  });

  if (guessedRecipient) initialValues.to = guessedRecipient._id;

  const initialRecipientName =
    guessedRecipient?.name ??
    officers.find((o) => o._id === initialValues.to)?.name;

  const recipientWasProvided = !!initialValues.to;

  return (
    <>
      <HeroTitle
        prose
        title={
          initialValues.to
            ? `Contact ${initialRecipientName}`
            : "Contact a club officer"
        }
        color="transparent"
      />
      <Container className="max-w-lg pb-12 pt-6 sm:pt-12">
        <div className="prose mx-auto pb-10">
          {!recipientWasProvided ? (
            <p>
              We’re a volunteer-run club that provides a safe and fun way to
              row, but we also need your help. Since we don’t have a full-time
              staff to respond to enquiries, we ask that you select an
              appropriate recipient for your enquiry.
            </p>
          ) : null}
        </div>
        <ContactForm contacts={officers} initialValues={initialValues} />
        <div className="prose mt-16 text-sm text-gray-500">
          Alternatively, mail{" "}
          <Obfuscate email="enquiries@sudburyrowingclub.org.uk" /> for general
          enquiries, or <Obfuscate email="regatta@sudburyrowingclub.org.uk" />{" "}
          for regatta-related enquiries.
        </div>
      </Container>
    </>
  );
};

export const CSRContactPage = ({
  officers,
}: {
  officers: Awaited<ReturnType<typeof fetchOfficerNames>>;
}) => (
  <Suspense fallback={<Loading />}>
    <ContactPage officers={officers} />
  </Suspense>
);
