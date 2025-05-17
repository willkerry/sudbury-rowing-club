type Props = {
  children: React.ReactNode;
};

const GovGrid = ({ children }: Props) => (
  <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
    {children}
  </div>
);

export default GovGrid;
