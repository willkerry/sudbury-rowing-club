import Link from "next/link";
import Image from "next/image";

export default function CoverImage({ title, src, slug, height, width }) {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className="rounded"
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
