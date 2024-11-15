import { unfurl } from "unfurl.js";
import { Iframe } from "./iframe";
import { Avatar, AvatarImage } from "../ui/avatar";
import Link from "../stour/link";
import { Error as ErrorComponent } from "../ui/error";

export const OEmbed = async ({ url }: { url: string }) => {
  try {
    const data = await unfurl(url, { oembed: true });

    if (data.oEmbed?.type === "rich" || data.oEmbed?.type === "video") {
      const { width, height, html, title, provider_name } = data.oEmbed;
      const src = html.match(/src="([^"]*)"/)?.[1];

      return (
        <figure>
          <Iframe src={src} aspectRatio={height / width} />
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
      const handle = url?.match(/https:\/\/x.com\/([^/]+)/)?.[1];

      return (
        <figure>
          <div className="not-prose border rounded-3xl p-2 text-sm max-w-sm">
            <div className="flex items-center gap-2 mb-3">
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
            src={data.open_graph.videos?.[0].url}
            aspectRatio={width && height && height / width}
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
        <figure className="border rounded p-2 text-sm max-w-xs">
          <img src={images?.[0].url} alt={title} />
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
        <figure className="border rounded p-2 text-sm max-w-xs">
          <img src={images?.[0].url} alt={title} />
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
    if (error instanceof Error) return <ErrorComponent error={error} />;
  }
};
