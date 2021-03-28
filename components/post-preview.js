import DateFormatter from "../components/date-formatter";
import CoverImage from "./cover-image";
import Link from "next/link";

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}) {
  return (
    <div>
      <div className="mb-5">
        {/* {CoverImage ? (
          <CoverImage
            slug={slug}
            title={title}
            src={coverImage}
            height={278}
            width={556}
          />
        ) : null} */}
      </div>
      <h3 className="mb-3 text-3xl leading-snug">
        <Link as={`/news/${slug}`} href="/news/[slug]">
          <a className="hover:underline">{title}</a>
        </Link>
      </h3>
      <div className="mb-4 text-lg">
        <DateFormatter dateString={date} />
      </div>
      <p className="mb-4 text-lg leading-relaxed">{excerpt}</p>
    </div>
  );
}
