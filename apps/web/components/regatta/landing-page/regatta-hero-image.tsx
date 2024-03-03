import Image from "next/image";
import { ArrowUpIcon } from "@heroicons/react/20/solid";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

type Props = {
  title: string;
  subtitle: string;
  aspectRatio: number;
  src: string;
  blurDataURL?: string;
};

const RegattaHeroImage = ({
  title,
  subtitle,
  aspectRatio,
  src,
  blurDataURL,
}: Props) => {
  const imageWidth = 984;
  const imageHeight = imageWidth / aspectRatio;
  return (
    <div className="relative flex overflow-hidden rounded-xl shadow-lg">
      <Image
        {...useSanityImageProps(src)}
        placeholder="blur"
        alt=""
        blurDataURL={blurDataURL}
        width={imageWidth}
        height={imageHeight}
      />
      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-tr from-black via-transparent to-transparent" />
      <div className="absolute left-0 top-0 flex h-full w-full items-end p-6 md:p-12">
        <div className="hidden w-2/3 sm:block">
          <div className="leading-tighter max-w-sm text-4xl font-bold tracking-tighter text-white drop-shadow md:text-6xl">
            {title}
          </div>
          <div className="font-medium text-white opacity-75">
            <ArrowUpIcon aria-hidden className="mb-px inline-flex h-4 w-4" />{" "}
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegattaHeroImage;
