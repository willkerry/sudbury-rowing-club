import { HundredAndFiftyContactButton } from "@/components/anniversary/150-contact-button";
import { Container } from "@/components/layouts/container";

const HundredAndFiftyLayout = ({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview: React.ReactNode;
}) => (
  <>
    {children}

    {preview}

    <Container className="py-24">
      <div className="prose mx-auto rounded-sm border p-4">
        <h2 className="text-lg">Contribute</h2>
        <p>
          We are collecting stories, photos, and memories from our members, past
          and present. If you have something you would like to contribute,
          please let us know.
        </p>

        <HundredAndFiftyContactButton />
      </div>
    </Container>
  </>
);

export default HundredAndFiftyLayout;
