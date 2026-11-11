import { Link } from "@/components/stour/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ErrorMessage } from "@/components/ui/error";
import { fetchEmbedData } from "./fetch-embed-data";
import { Iframe } from "./iframe";

const TWITTER_HANDLE_REGEX = /https:\/\/x.com\/([^/]+)/;
const IFRAME_SRC_REGEX = /src="([^"]*)"/;

export const OEmbed = async ({ url }: { url: string }) => {
  try {
    const data = await fetchEmbedData(url);

    if (data.oEmbed?.type === "rich" || data.oEmbed?.type === "video") {
      const { width, height, html, title, provider_name } = data.oEmbed;
      const src = html?.match(IFRAME_SRC_REGEX)?.[1];

      return (
        <figure>
          <Iframe
            aspectRatio={width && height ? height / width : undefined}
            src={src}
          />
          <figcaption>
            <a href={data.canonicalUrl}>
              <em>{title}</em>
            </a>
            , on {provider_name}.
          </figcaption>
        </figure>
      );
    }

    if (data.openGraph?.siteName?.includes("Twitter")) {
      const { description, title, images, url, siteName } = data.openGraph;

      const username = title?.split(" (")[0];
      const handle = url?.match(TWITTER_HANDLE_REGEX)?.[1];

      return (
        <figure>
          <div className="not-prose max-w-sm rounded-3xl border p-2 text-sm">
            <div className="mb-3 flex items-center gap-2">
              <Avatar>
                <AvatarImage src={images[0]?.url} />
              </Avatar>
              <div className="leading-tight">
                <div className="font-bold">{username}</div>
                <div className="font-medium text-gray-500 text-xs">
                  @{handle}
                </div>
              </div>
            </div>

            <blockquote className="mb-3 whitespace-pre-line">
              {description}
            </blockquote>
          </div>

          <figcaption>
            Tweet by <em>{username}</em> on <em>{siteName}</em>.{" "}
            {url && (
              <Link external href={url}>
                Open on external site
              </Link>
            )}
          </figcaption>
        </figure>
      );
    }

    if (data.openGraph?.type?.includes("video")) {
      const [width, height] = [
        data.openGraph.videos[0]?.width,
        data.openGraph.videos[0]?.height,
      ];

      return (
        <figure>
          <Iframe
            aspectRatio={width && height && height / width}
            src={data.openGraph.videos[0]?.url}
          />
          <figcaption>
            <a href={data.canonicalUrl}>
              <em>{data.title}</em>
            </a>
            , on {data.openGraph.siteName}.
          </figcaption>
        </figure>
      );
    }

    if (data.openGraph?.type?.includes("product")) {
      const { title, images, url, siteName } = data.openGraph;

      return (
        <figure className="max-w-xs rounded-sm border p-2 text-sm">
          <img alt={title} src={images[0]?.url} />
          <figcaption>
            <a href={url}>
              <em>{title}</em>
            </a>
            , on {siteName}.
          </figcaption>
        </figure>
      );
    }

    if (data.openGraph?.type?.includes("website")) {
      const { title, images, url, siteName = "" } = data.openGraph;

      return (
        <figure className="max-w-xs rounded-sm border p-2 text-sm">
          <img alt={title} src={images[0]?.url} />
          <figcaption>
            <a href={url}>
              <em>{title}</em>
            </a>
            , on {siteName}.
          </figcaption>
        </figure>
      );
    }

    if (data.canonicalUrl) {
      return <Link href={data.canonicalUrl}>{data.title}</Link>;
    }

    return <Link href={url}>{data.title}</Link>;
  } catch (error) {
    if (error instanceof Error) return <ErrorMessage error={error} />;
  }
};
