import type { NextPage } from "next";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import { useQuery } from "@tanstack/react-query";
import { fetchOfficerNames } from "@sudburyrc/api";
import { browserIndexOfficers, serverIndexOfficers } from "@/lib/algolia";
import { makeShareImageURL } from "@/lib/og-image";
import ContactForm from "@/components/contact";
import type { Message } from "@/components/contact/contactForm";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import HeroTitle from "@/components/stour/hero/hero-title";

export const getStaticProps = async () => {
  const officers = await fetchOfficerNames();

  serverIndexOfficers.replaceAllObjects(
    officers.map((o) => ({ ...o, objectID: o._id })),
  );

  return {
    props: {
      officers,
    },
  };
};

const Contact: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  officers,
}) => {
  const router = useRouter();
  const { q, ...initialValues } = router.query as Message & { q?: string };

  const { data: guessedRecipient } = useQuery({
    queryKey: ["officers", q],
    queryFn: () =>
      browserIndexOfficers
        .search<
          InferGetStaticPropsType<typeof getStaticProps>["officers"][number]
        >(q || "")
        .then((r) => r.hits[0]),
    enabled: !!q,
    staleTime: Infinity,
  });

  if (guessedRecipient) initialValues.to = guessedRecipient._id;

  return (
    <Layout>
      <NextSeo
        description="Get in touch"
        openGraph={{
          description: "Get in touch",
          images: [
            { url: makeShareImageURL("Contact Sudbury Rowing Club", true) },
          ],
          title: "Contact Sudbury Rowing Club",
        }}
        title="Contact Sudbury Rowing Club"
      />
      <HeroTitle prose title="Contact a club officer" color="transparent" />
      <Container className="max-w-lg py-12">
        <div className="prose mx-auto pb-10">
          <p>
            We’re a volunteer-run club that provides a safe and fun way to row,
            but we also need your help. Since we don’t have a full-time staff to
            respond to enquiries, we ask that you select an appropriate
            recipient for your enquiry.
          </p>
        </div>
        <ContactForm contacts={officers} initialValues={initialValues} />
        <div className="prose mt-16 text-sm text-gray-500">
          Alternatively, mail{" "}
          <Obfuscate email="enquiries@sudburyrowingclub.org.uk" /> for general
          enquiries, or <Obfuscate email="regatta@sudburyrowingclub.org.uk" />{" "}
          for regatta-related enquiries.
        </div>
      </Container>
    </Layout>
  );
};

export default Contact;
