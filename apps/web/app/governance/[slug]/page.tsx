import { DocPage } from "@/components/layouts/doc-page";
import { createMetadata } from "@/lib/create-metadata";
import { smartQuotes } from "@sudburyrc/helpers";
import { allPolicies } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { title as formatTitle } from "radash";

export const generateStaticParams = async () =>
  allPolicies.map((policy) => ({
    slug: policy._meta.path,
  }));

export const generateMetadata = async (props: {
  params: Promise<Awaited<ReturnType<typeof generateStaticParams>>[number]>;
}): Promise<Metadata> => {
  const params = await props.params;
  const policy = allPolicies.find(
    (policy) => policy._meta.path === params.slug,
  );

  if (!policy) return {};

  return createMetadata({
    title: smartQuotes(policy.title || formatTitle(policy._meta.path)),
    type: "article",
  });
};

const TestPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const policy = allPolicies.find((policy) => policy._meta.path === slug);

  const isDevelopment = process.env.NODE_ENV === "development";

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
