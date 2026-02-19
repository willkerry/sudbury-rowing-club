import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import { Container } from "@/components/layouts/container";

const Archive = async ({ children }: { children: React.ReactNode }) => (
  <>
    <HundredAndFiftyHeader href="/150/gallery" title="Archive resource" />

    <Container>{children}</Container>
  </>
);

export default Archive;
