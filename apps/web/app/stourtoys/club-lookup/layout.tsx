import TextPage from "@/components/layouts/text-page";

const Clubs = ({
  children,
  results,
}: {
  children: React.ReactNode;
  results: React.ReactNode;
}) => (
  <TextPage title="Rowing club lookup" color="transparent" prose="max-w-prose">
    {children}
    {results}
  </TextPage>
);

export default Clubs;
