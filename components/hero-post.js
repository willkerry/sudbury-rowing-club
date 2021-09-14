import DateFormatter from "../components/date-formatter";
import CoverImage from "../components/cover-image";
import Link from "next/link";

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}) {
  return (
    <section className="grid overflow-hidden md:grid-cols-3 md:gap-x-16 lg:gap-x-8">
      <div className="md:col-span-2">
        <div className="relative mb-8 rounded shadow-lg h-60 sm:h-96 md:mb-16">
          <CoverImage
            title={title}
            src={coverImage}
            slug={slug}
            height={620}
            width={1240}
          />
        </div>
      </div>
      <div>
        <div className="mb-3 font-medium text-gray-700">
          <DateFormatter dateString={date} />
        </div>
        <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tighter text-gray-900 lg:text-5xl">
          <Link as={`/news/${slug}`} href="/news/[slug]">
            <a className="">{title}</a>
          </Link>
        </h3>
        <p className="mb-4 text-lg text-gray-600">{excerpt}</p>
      </div>
    </section>
  );
}
