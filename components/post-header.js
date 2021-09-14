import DateFormatter from "../components/date-formatter";
import PostTitle from "../components/post-title";
import Image from "next/image";
import Label from "./stour/label";
export default function PostHeader({ title, coverImage, date, author }) {
  return (
    <>
      <div className="max-w-2xl mx-auto my-12 text-center">
        <Label>
          <DateFormatter dateString={date} />
        </Label>

        <PostTitle>{title}</PostTitle>
      </div>

      {coverImage && (
        <div className="mb-8 md:mb-16 sm:mx-0">
          <div className="h-56 max-w-3xl mx-auto sm:h-64 md:h-96">
            <div className="relative h-full max-w-full rounded shadow-lg">
              <Image
                src={coverImage}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="rounded bg-gray-50"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
