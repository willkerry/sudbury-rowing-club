import Image from "next/image";
import { urlFor } from "@/lib/sanity";

function LandingImages(props) {
  const images = props.images.slice(0, 3);
  return (
    <div className="my-10 border-t border-b sm:my-16">
      <div className="flex flex-row">
        {images.map(({ _id, caption, lqip }, index) => (
          <div key={index} className="relative w-1/3 h-24 bg-black sm:h-72">
            <Image
              src={urlFor(_id).height(576).url()}
              alt={caption}
              layout="fill"
              sizes="33.3vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={lqip}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default LandingImages;
