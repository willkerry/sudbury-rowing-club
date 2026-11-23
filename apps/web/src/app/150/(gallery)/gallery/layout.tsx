import { HundredAndFiftyBanner } from "@/components/anniversary/150-banner";

const HundredAndFiftyLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <HundredAndFiftyBanner />

    {children}
  </>
);

export default HundredAndFiftyLayout;
