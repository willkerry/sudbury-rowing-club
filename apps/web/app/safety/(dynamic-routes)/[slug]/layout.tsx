import { fetchSafetyById } from "@sudburyrc/api";
import { notFound } from "next/navigation";
import TextPage from "@/components/layouts/text-page";

const SafetyItemLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const entry = await fetchSafetyById(slug);

  if (!entry) return notFound();

  const { title } = entry;

  return <TextPage title={title}>{children}</TextPage>;
};

export default SafetyItemLayout;
