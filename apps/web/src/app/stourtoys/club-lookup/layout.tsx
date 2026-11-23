import TextPage from "@/components/layouts/text-page";

const SearchLayout = ({
  children,
  results,
}: {
  children: React.ReactNode;
  results: React.ReactNode;
}) => (
  <TextPage prose="max-w-prose" title="Rowing club lookup">
    {children}
    {results}
  </TextPage>
);

export default SearchLayout;
