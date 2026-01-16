import TextPage from "@/components/layouts/text-page";

const SearchLayout = ({
  children,
  results,
}: {
  children: React.ReactNode;
  results: React.ReactNode;
}) => (
  <TextPage title="Rowing club lookup" prose="max-w-prose">
    {children}
    {results}
  </TextPage>
);

export default SearchLayout;
