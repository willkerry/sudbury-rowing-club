import { fetchGovernance } from "@sudburyrc/api";
import type { Metadata } from "next";
import {
  Committees,
  Documents,
  NonExec,
  Officers,
} from "@/components/governance";
import { Container } from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import { makeShareImageURL } from "@/lib/og-image";
import { sdk } from "@/lib/server/payload";

const title = "Governance";
const description = "How is Sudbury Rowing Club run?";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: makeShareImageURL("Governance", true) }],
  },
};

const Governance = async () => {
  const { officers, committees, vicePresidents, trustees, documents } =
    await fetchGovernance();

  // const foo = await sdk.find({
  //   collection: "officers",
  //   limit: 100,
  // });

  const people = await sdk.find({
    collection: "people",
    limit: 100,
  });

  // await sdk.create({
  //   collection: "people",
  //   data: filteredForValidity.map((person) => {
  //     return {
  //       guid: person._id,
  //       firstName: person.firstName,
  //       lastName: person.surname,
  //       email: person.email,
  //     };
  //   }),
  // });

  // for (const person of filteredForValidity) {
  //   await sdk.create({
  //     collection: "people",
  //     data: {
  //       guid: person._id,
  //       firstName: person.firstName,
  //       lastName: person.surname,
  //       email: person.email,
  //     },
  //   });
  // }

  // for (const officer of foo.docs) {
  //   const oldOfficer = officers.find((o) => o.role === officer.role);
  //   if (!oldOfficer) continue;

  //   // using 'role' find the id of the officer
  //   const newOfficerId = foo.docs.find((o) => o.role === oldOfficer.role)?.id;
  //   if (!newOfficerId) continue;

  //   await sdk.update({
  //     collection: "officers",
  //     id: newOfficerId,
  //     data: {
  //       guid: oldOfficer._id,
  //     },
  //   });
  // }

  return (
    <>
      <PageHeader breadcrumbs title="Governance" />
      <pre>{JSON.stringify(people, null, 2)}</pre>
      <Container className="mb-16">
        <Officers officers={officers} />
        <Committees committees={committees} />
        <NonExec trustees={trustees} vicePresidents={vicePresidents} />
        <Documents documents={documents} />
      </Container>
    </>
  );
};

export default Governance;
