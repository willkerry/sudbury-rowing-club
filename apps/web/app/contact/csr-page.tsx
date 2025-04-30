"use client";

import ContactForm from "@/components/contact";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Loading from "@/components/stour/loading";
import { browserIndexOfficers } from "@/lib/algolia";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import type { fetchOfficerNames } from "@sudburyrc/api";
import { useQuery } from "@tanstack/react-query";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { shake } from "radash";
import { Suspense } from "react";

const ContactPage = ({
  officers,
}: {
  officers: Awaited<ReturnType<typeof fetchOfficerNames>>;
}) => {
  const [{ q, ...initialValues }] = useQueryStates({
    q: parseAsArrayOf(parseAsString),
    to: parseAsString,
    name: parseAsString,
    email: parseAsString,
    message: parseAsString,
  });

  const { data: guessedRecipient } = useQuery({
    queryKey: ["officers", q],
    queryFn: () =>
      Promise.all(
        (q ?? []).map((query) =>
          browserIndexOfficers
            .search<(typeof officers)[number]>(query)
            .then((r) => r.hits[0]),
        ),
      ),
    enabled: !!q,
    staleTime: Number.POSITIVE_INFINITY,
    select: (data) => data.filter((d) => d)[0],
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
      <Container className="max-w-lg pt-6 pb-12 sm:pt-12">
        <div className="prose mx-auto pb-10">
          {recipientWasProvided ? null : (
            <p>
              We’re a volunteer-run club that provides a safe and fun way to
              row, but we also need your help. Since we don’t have a full-time
              staff to respond to enquiries, we ask that you select an
              appropriate recipient for your enquiry.
            </p>
          )}
        </div>
        <ContactForm contacts={officers} initialValues={shake(initialValues)} />
        <div className="prose mt-16 text-gray-500 text-sm">
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
