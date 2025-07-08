"use client";

import { ContactForm } from "@/components/contact";
import Container from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import Loading from "@/components/stour/loading";
import { OFFICERS_INDEX_NAME, getBrowserClient } from "@/lib/algolia";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import type { OfficerResponse, fetchOfficerNames } from "@sudburyrc/api";
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
      getBrowserClient().searchForHits<OfficerResponse>({
        requests: (q ?? []).map((query) => ({
          indexName: OFFICERS_INDEX_NAME,
          query,
        })),
      }),
    enabled: !!q,
    staleTime: Number.POSITIVE_INFINITY,
    select: (data) => data.results.flatMap((d) => d.hits)?.[0],
  });

  if (guessedRecipient) initialValues.to = guessedRecipient._id;

  const initialRecipientName =
    guessedRecipient?.name ??
    officers.find((o) => o._id === initialValues.to)?.name;

  const recipientWasProvided = !!initialValues.to;

  return (
    <>
      <PageHeader
        prose
        title={
          initialValues.to
            ? `Contact ${initialRecipientName}`
            : "Contact a club officer"
        }
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
