import Image from "next/image";
import { urlFor, Article } from "@sudburyrc/api";
import LightBox from "@/components/stour/lightbox";
import { useToggle } from "@mantine/hooks";
import Caption from "./caption";
import PostTitle from "./title";

type Props = Pick<Article, "title" | "date" | "featuredImage">;

const HeaderLightBox = ({
  featuredImage,
  title,
  open,
  toggleOpen,
}: Pick<Props, "featuredImage" | "title"> & {
  open: boolean;
  toggleOpen: () => void;
}) => {
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

const PostHeader = ({ title, date, featuredImage }: Props) => {
  const [open, toggleOpen] = useToggle();

  if (featuredImage && featuredImage.aspectRatio > 1)
    return (
      <>
        <PostTitle date={date} title={title} center />
        <div className="mb-8 sm:mx-0 md:mb-16">
          <HeaderLightBox {...{ featuredImage, title, open, toggleOpen }} />
          <figure
            className="relative mx-auto flex max-w-3xl flex-col overflow-hidden rounded bg-gray-200 text-gray-600"
            style={{
              backgroundColor: featuredImage.background || "transparent",
              color: featuredImage.foreground || "inherit",
            }}
          >
            <button
              type="button"
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
      <div className="mx-auto mb-8 max-w-3xl flex-row items-center gap-8 sm:flex md:mb-16">
        <PostTitle date={date} title={title} />
        <div className="relative flex-none">
          <HeaderLightBox {...{ featuredImage, title, open, toggleOpen }} />
          <figure
            className="flex flex-col overflow-hidden rounded shadow-lg"
            style={{
              maxWidth: 512 * featuredImage.aspectRatio,
              backgroundColor: featuredImage.background || undefined,
              color: featuredImage.foreground || undefined,
            }}
          >
            <button
              type="button"
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
