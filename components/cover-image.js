import cn from "classnames";
import Link from "next/link";
import Image from "next/image";

export default function CoverImage({ title, src, slug, height, width }) {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn("shadow-sm", {
        "hover:shadow-md transition-shadow duration-200 z-0 rounded border": slug,
      })}
      layout="fill"
      objectFit="cover"
    />
  );
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/news/${slug}`} href="/news/[slug]">
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  );
}
