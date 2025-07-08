import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import { Container } from "@/components/layouts/container";

const Archive = async ({ children }: { children: React.ReactNode }) => (
  <>
    <HundredAndFiftyHeader title="Archive resource" href="/150/gallery" />

    <Container>{children}</Container>
  </>
);

export default Archive;
