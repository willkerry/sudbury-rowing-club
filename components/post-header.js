import DateFormatter from "../components/date-formatter";
import PostTitle from "../components/post-title";
import Image from "next/image";
import Label from "./stour/label";
import { urlFor } from "@/lib/sanity";
import cn from "classnames";

export default function PostHeader({
  title,
  featuredImage,
  date,
  alt,
  caption,
  lqip,
}) {
  return featuredImage && featuredImage.aspectRatio > 1 ? (
    <>
      <Heading date={date} title={title} center />
      <div className="mb-8 md:mb-16 sm:mx-0">
        <figure className="relative flex flex-col mx-auto overflow-hidden rounded w-max">
          
            <Image
              src={urlFor(featuredImage._id).width(1536).url()}
              alt={alt}
              width={768}
              height={768 / featuredImage.aspectRatio}
              className="bg-gray-50"
              placeholder="blur"
              blurDataURL={lqip}
            />
          {caption && (
            <figcaption
              className="w-full px-3 py-2 mx-auto text-xs font-medium text-white bg-gray-500 bg-bottom bg-cover"
              style={{ backgroundImage: `url(${lqip})`, maxWidth: "768px" }}
            >
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </>
  ) : featuredImage && featuredImage.aspectRatio < 1 ? (
    <div className="flex-row items-center max-w-3xl gap-8 mx-auto mb-8 sm:flex md:mb-16">
      <div className="my-12">
        <Label>
          <DateFormatter dateString={date} />
        </Label>
        <PostTitle>{title}</PostTitle>
      </div>
      <div className="relative flex-none">
        <div
          className="flex overflow-hidden rounded shadow-lg"
          style={{ maxWidth: 512 * featuredImage.aspectRatio }}
        >
          <Image
            src={urlFor(featuredImage._id).height(1024).url()}
            alt={title}
            width={512 * featuredImage.aspectRatio}
            height={512}
            className="bg-gray-50"
          />
        </div>
      </div>
    </div>
  ) : (
    <Heading date={date} title={title} center />
  );
}

function Heading({ date, title, center }) {
  return (
    <div className={cn("max-w-2xl mx-auto my-12", center && "text-center")}>
      <Label>
        <DateFormatter dateString={date} />
      </Label>
      <PostTitle>{title}</PostTitle>
    </div>
  );
}
