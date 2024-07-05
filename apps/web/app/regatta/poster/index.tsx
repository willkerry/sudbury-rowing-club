import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layouts/container";
import Hero from "@/components/stour/hero";
import obverse from "./obverse.jpg";
import reverse from "./reverse.jpg";

export const Poster = () => (
  <Container className="my-24 flex flex-col gap-12 lg:flex-row lg:items-center">
    <div>
      <Hero title="Anniversary" label="150 years of rowing in Sudbury" />

      <div className="prose">
        <p>
          Although this year’s regatta will be our 142nd, it falls during our
          club’s 150th year. In celebration of that milestone, this year’s
          poster contains a collage of images from the club’s past.
        </p>
        <p>
          Detailed entry information is available on the{" "}
          <Link href="/regatta/entries">entry information</Link> page.
        </p>
      </div>
    </div>

    <div className="flex gap-2">
      <a href={obverse.src}>
        <Image
          src={obverse}
          className="rounded"
          alt="Obverse of the poster"
          width={200}
        />
      </a>
      <a href={reverse.src}>
        <Image
          src={reverse}
          className="rounded"
          alt="Reverse of the poster"
          width={200}
        />
      </a>
    </div>
  </Container>
);
