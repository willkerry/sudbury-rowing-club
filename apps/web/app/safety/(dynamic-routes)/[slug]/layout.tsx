import TextPage from "@/components/layouts/text-page";
import { fetchSafetyById } from "@sudburyrc/api";

const SafetyItemLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const { title } = await fetchSafetyById(params.slug);

  return (
    <TextPage title={title} color="transparent">
      {children}
    </TextPage>
  );
};

export default SafetyItemLayout;
