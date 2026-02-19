import { unfurl } from "unfurl.js";
import { Link } from "@/components/stour/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ErrorMessage } from "@/components/ui/error";
import { Iframe } from "./iframe";

const TWITTER_HANDLE_REGEX = /https:\/\/x.com\/([^/]+)/;
const IFRAME_SRC_REGEX = /src="([^"]*)"/;

export const OEmbed = async ({ url }: { url: string }) => {
  try {
    const data = await unfurl(url, { oembed: true });

    if (data.oEmbed?.type === "rich" || data.oEmbed?.type === "video") {
      const { width, height, html, title, provider_name } = data.oEmbed;
      const src = html.match(IFRAME_SRC_REGEX)?.[1];

      return (
        <figure>
          <Iframe aspectRatio={height / width} src={src} />
          <figcaption>
            <a href={data.canonical_url}>
              <em>{title}</em>
            </a>
            , on {provider_name}.
          </figcaption>
        </figure>
      );
    }

    if (data.open_graph?.site_name?.includes("Twitter")) {
      const { description, title, images, url, site_name } = data.open_graph;

      const username = title.split(" (")?.[0];
      const handle = url?.match(TWITTER_HANDLE_REGEX)?.[1];

      return (
        <figure>
          <div className="not-prose max-w-sm rounded-3xl border p-2 text-sm">
            <div className="mb-3 flex items-center gap-2">
              <Avatar>
                <AvatarImage src={images?.[0].url} />
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
            Tweet by <em>{username}</em> on <em>{site_name}</em>.{" "}
            {url && (
              <Link external href={url}>
                Open on external site
              </Link>
            )}
          </figcaption>
        </figure>
      );
    }

    if (data.open_graph?.type?.includes("video")) {
      const [width, height] = [
        data.open_graph.videos?.[0].width,
        data.open_graph.videos?.[0].height,
      ];

      return (
        <figure>
          <Iframe
            aspectRatio={width && height && height / width}
            src={data.open_graph.videos?.[0].url}
          />
          <figcaption>
            <a href={data.canonical_url}>
              <em>{data.title}</em>
            </a>
            , on {data.open_graph.site_name}.
          </figcaption>
        </figure>
      );
    }

    if (data.open_graph?.type?.includes("product")) {
      const { title, images, url, site_name } = data.open_graph;

      return (
        <figure className="max-w-xs rounded-sm border p-2 text-sm">
          <img alt={title} src={images?.[0].url} />
          <figcaption>
            <a href={url}>
              <em>{title}</em>
            </a>
            , on {site_name}.
          </figcaption>
        </figure>
      );
    }

    if (data.open_graph?.type?.includes("website")) {
      const { title, images, url, site_name = "" } = data.open_graph;

      return (
        <figure className="max-w-xs rounded-sm border p-2 text-sm">
          <img alt={title} src={images?.[0].url} />
          <figcaption>
            <a href={url}>
              <em>{title}</em>
            </a>
            , on {site_name}.
          </figcaption>
        </figure>
      );
    }

    if (data.canonical_url) {
      return <Link href={data.canonical_url}>{data.title}</Link>;
    }

    return <Link href={url}>{data.title}</Link>;
  } catch (error) {
    if (error instanceof Error) return <ErrorMessage error={error} />;
  }
};
