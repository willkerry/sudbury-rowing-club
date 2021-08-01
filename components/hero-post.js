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
    <section>
      <div className="grid overflow-hidden md:grid-cols-3 md:gap-x-16 lg:gap-x-8">
        <div>
          <div className="mb-3 font-medium">
            <DateFormatter dateString={date} />
          </div>
          <h3 className="mb-4 font-serif text-2xl leading-tight lg:text-5xl">
            <Link as={`/news/${slug}`} href="/news/[slug]">
              <a className="">{title}</a>
            </Link>
          </h3>
          <p className="mb-4 text-lg text-gray-600">{excerpt}</p>
        </div>
        <div className="order-first md:col-span-2">
          <div className="relative mb-8 rounded-lg h-96 md:mb-16">
            <CoverImage
              title={title}
              src={coverImage}
              slug={slug}
              height={620}
              width={1240}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
