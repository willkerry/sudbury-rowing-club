import Link from "next/link";
import Container from "../layouts/container";
import Label from "../stour/label";

export const HundredAndFiftyHeader = ({
  title,
  href,
}: {
  title: string;
  href: string;
}) => (
  <div className="mb-8 border-b py-3">
    <Container className="flex flex-row justify-between">
      <h1>
        <Label>{title}</Label>
      </h1>
      <Link href={href} className="text-blue-950 hover:text-blue-700">
        ← Back
      </Link>
    </Container>
  </div>
);
