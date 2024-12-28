import TextPage from "@/components/layouts/text-page";
import { fetchSafetyById } from "@sudburyrc/api";

const SafetyItemLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const { title } = await fetchSafetyById(slug);

  return (
    <TextPage title={title} color="transparent">
      {children}
    </TextPage>
  );
};

export default SafetyItemLayout;
