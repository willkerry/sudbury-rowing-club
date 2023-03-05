import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import PostTitle from "./title";
import Caption from "./caption";
import { Article } from "@/lib/queries/fetch-news-article";
import LightBox from "@/components/stour/lightbox";
import { useToggle } from "@mantine/hooks";

type Props = Pick<Article, "title" | "date" | "featuredImage">;

const PostHeader = ({ title, date, featuredImage }: Props) => {
  const [open, toggleOpen] = useToggle();

  const HeaderLightBox = () => {
    if (!featuredImage) return null;
    return (
      <LightBox
        src={urlFor(featuredImage._id).url()}
        alt={featuredImage.alt || featuredImage.caption || title}
        aspectRatio={featuredImage.aspectRatio}
        lqip={featuredImage.lqip}
        open={open}
        toggle={toggleOpen}
      />
    );
  };

  if (featuredImage && featuredImage.aspectRatio > 1)
    return (
      <>
        <PostTitle date={date} title={title} center />
        <div className="mb-8 md:mb-16 sm:mx-0">
          <HeaderLightBox />
          <figure className="relative flex flex-col max-w-3xl mx-auto overflow-hidden text-gray-600 bg-gray-200 rounded">
            <style jsx>{`
              figure {
                background-color: ${featuredImage.background};
                color: ${featuredImage.foreground};
              }
            `}</style>

            <button
              onClick={() => toggleOpen()}
              className="hover:cursor-zoom-in"
            >
              <Image
                src={urlFor(featuredImage._id).width(1536).fit("max").url()}
                alt={featuredImage.lqip}
                width={768}
                height={768 / featuredImage.aspectRatio}
              />
            </button>
            {featuredImage.caption && (
              <Caption caption={featuredImage.caption} />
            )}
          </figure>
        </div>
      </>
    );

  if (featuredImage)
    return (
      <div className="flex-row items-center max-w-3xl gap-8 mx-auto mb-8 sm:flex md:mb-16">
        <PostTitle date={date} title={title} />
        <div className="relative flex-none">
          <HeaderLightBox />
          <figure
            className="flex flex-col overflow-hidden rounded shadow-lg"
            style={{ maxWidth: 512 * featuredImage.aspectRatio }}
          >
            <style jsx>{`
              figure {
                background-color: ${featuredImage.background};
                color: ${featuredImage.foreground};
              }
            `}</style>

            <button
              onClick={() => toggleOpen()}
              className="hover:cursor-zoom-in"
            >
              <Image
                src={urlFor(featuredImage._id).height(1024).fit("max").url()}
                alt={title}
                width={512 * featuredImage.aspectRatio}
                height={512}
                quality={50}
                className="bg-gray-50"
                placeholder="blur"
                blurDataURL={featuredImage.lqip}
              />
            </button>
            {featuredImage.caption && (
              <Caption caption={featuredImage.caption} />
            )}
          </figure>
        </div>
      </div>
    );
  return <PostTitle date={date} title={title} center />;
};

export default PostHeader;
