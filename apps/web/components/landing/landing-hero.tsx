import BoathouseDoor from "@/components/landing/boathouse-door";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import dynamic from "next/dynamic";
import Image from "next/image";
import Container from "../layouts/container";

const Player = dynamic(() => import("@/components/landing/player"));

type Props = {
  imageId: string;
  imageAspectRatio: number;
  imageLqip: string;
  slogan: string;
  youTubeId: string;
  youTubeStart: number;
};

const LandingHero = ({
  imageId,
  imageAspectRatio,
  imageLqip,
  slogan,
  youTubeId,
  youTubeStart,
}: Props) => (
  <Container>
    <div className="group relative flex overflow-hidden rounded shadow">
      <Image
        {...useSanityImageProps(imageId)}
        width={992}
        height={992 / imageAspectRatio}
        alt="Aerial photograph of a Sudbury crew training."
        quality={30}
        placeholder="blur"
        blurDataURL={imageLqip}
        priority
      />
      <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center gap-3 p-6 lg:gap-14 md:gap-12 sm:gap-8 md:p-24 sm:p-12">
        <BoathouseDoor aria-hidden className="z-10 w-full text-white" />
        <span className="z-10 rounded-full bg-white px-1 py-0.5 font-medium text-black text-xs mix-blend-screen shadow backdrop-blur md:px-3 md:py-1 md:text-base sm:text-sm">
          {slogan}
        </span>
      </div>
      <Player youTubeId={youTubeId} youTubeStart={youTubeStart} />
    </div>
  </Container>
);
export default LandingHero;
