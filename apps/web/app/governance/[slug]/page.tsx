import { smartQuotes } from "@sudburyrc/helpers";
import { allPolicies } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { title as formatTitle } from "radashi";
import { DocPage } from "@/components/layouts/doc-page";
import { env } from "@/env";
import { createMetadata } from "@/lib/create-metadata";

type PolicyPageParams = { slug: string };
type PolicyPageParamObject = { params: Promise<PolicyPageParams> };

export const generateStaticParams = async (): Promise<PolicyPageParams[]> =>
  allPolicies.map((policy) => ({
    slug: policy._meta.path,
  }));

export const generateMetadata = async ({
  params,
}: PolicyPageParamObject): Promise<Metadata> => {
  const { slug } = await params;
  const policy = allPolicies.find((policy) => policy._meta.path === slug);

  if (!policy) return {};

  return createMetadata({
    title: smartQuotes(policy.title || formatTitle(policy._meta.path)),
    type: "article",
  });
};

const TestPage = async ({ params }: PolicyPageParamObject) => {
  const { slug } = await params;

  const policy = allPolicies.find((policy) => policy._meta.path === slug);

  const isDevelopment = env.NODE_ENV === "development";

  if (!policy || (!isDevelopment && policy.status === "draft"))
    return notFound();

  return (
    <DocPage
      title={policy.title || formatTitle(policy._meta.path)}
      description={policy.description}
      prenotes={policy.prenotes}
      postnotes={policy.postnotes}
      body={policy.body}
      toc={policy.toc}
    />
  );
};

export default TestPage;
