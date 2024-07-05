import Image from "next/image";
import Container from "@/components/layouts/container";
import Hero from "@/components/stour/hero";
import obverse from "./obverse.jpg";
import reverse from "./reverse.jpg";

export const Poster = () => (
  <Container className="mb-36">
    <Hero title="Poster" label="This year’s regatta poster" />

    <div className="flex gap-2">
      <a href={obverse.src}>
        <Image src={obverse} alt="Obverse of the poster" width={200} />
      </a>
      <a href={reverse.src}>
        <Image src={reverse} alt="Reverse of the poster" width={200} />
      </a>
    </div>
  </Container>
);
