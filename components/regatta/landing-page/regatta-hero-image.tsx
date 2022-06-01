import Image from "next/image";
import { ArrowUpIcon } from "@heroicons/react/solid";
import { urlFor } from "@/lib/sanity";

type Props = {
  title: string;
  subtitle: string;
  aspectRatio: number;
  src: string;
  blurDataURL: string;
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
    <div className="relative flex overflow-hidden shadow-lg rounded-xl">
      <Image
        src={urlFor(src)
          .width(2 * imageWidth)
          .height(2 * imageHeight)
          .url()}
        placeholder="blur"
        alt=""
        blurDataURL={blurDataURL}
        width={imageWidth}
        height={imageHeight}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black via-transparent to-transparent" />
      <div className="absolute top-0 left-0 flex items-end w-full h-full p-6 md:p-12">
        <div className="hidden w-2/3 sm:block">
          <div className="max-w-sm text-4xl font-bold tracking-tighter text-white md:text-6xl leading-tighter drop-shadow">
            {title}
          </div>
          <div className="font-medium text-white opacity-75">
            <ArrowUpIcon className="inline-flex w-4 h-4 mb-px" /> {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegattaHeroImage;
