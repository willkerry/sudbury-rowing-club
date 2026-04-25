import { buildCloudflareImageUrl } from "@sudburyrc/images";
import parse, {
  attributesToProps,
  type DOMNode,
  domToReact,
  type Element,
  type HTMLReactParserOptions,
} from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import React from "react";

const ABSOLUTE_URL = /^https?:\/\//i;

/**
 * Duck-typed element check. `instanceof Element` is unreliable here – the
 * pnpm graph has two copies of `domhandler` (5.x via html-react-parser,
 * 6.x via cheerio), so the class identity from one package never matches
 * the nodes constructed by the other.
 */
const isElement = (node: DOMNode): node is Element => node.type === "tag";

const parserOptions: HTMLReactParserOptions = {
  replace(node) {
    if (!isElement(node)) return;

    // Internal links become Next <Link> for client-side navigation.
    // External anchors fall through to the default <a> rendering.
    if (node.name === "a") {
      const href = node.attribs.href;
      if (href?.startsWith("/live/")) {
        const props = attributesToProps(node.attribs);

        return (
          <Link {...props} href={href}>
            {domToReact(node.children as DOMNode[], parserOptions)}
          </Link>
        );
      }
    }

    // Absolute <img> URLs are rewritten to go through the Cloudflare CDN,
    // so the origin (British Rowing) is never hit directly. We emit a
    // plain <img> rather than Next <Image> because this component's output
    // crosses the server-client boundary during client-side navigation,
    // and Next Image's `loader` prop is a function that cannot be
    // serialised through Flight. Cloudflare already handles resize,
    // format negotiation and caching at the CDN layer.
    if (node.name === "img" && node.attribs.src) {
      const src = node.attribs.src;
      if (!ABSOLUTE_URL.test(src)) return;

      const props = attributesToProps(node.attribs);
      const width = Number.parseInt(node.attribs.width ?? "150", 10);
      const height = Number.parseInt(node.attribs.height ?? "70", 10);
      const alt = node.attribs.alt ?? node.attribs.title ?? "";
      const cdnSrc = buildCloudflareImageUrl(src, {
        width,
        format: "auto",
      });

      return (
        <img
          {...props}
          alt={alt}
          decoding="async"
          height={height}
          loading="lazy"
          src={cdnSrc}
          width={width}
        />
      );
    }

    if (node.name === "center") return <React.Fragment />;

    if (node.name === "td") {
      // if content is just "Q", "S", or "F"
      // return <React.Fragment />;
      if (
        node.children.some(
          (child) =>
            child.type === "text" && ["Q", "S", "F"].includes(child.data),
        )
      ) {
        const content = node.children
          .map((child) => {
            if (child.type === "text") return child.data;
            return "";
          })
          .join("");
        return (
          <div className="flex inline-flex h-6 w-6 items-center justify-center rounded-sm bg-amber-200 text-xs">
            {content}
          </div>
        );
      }
    }
  },
};

/**
 * Renders already-sanitised regatta HTML as a React tree. A second DOMPurify
 * pass runs here as belt-and-braces, then `html-react-parser` converts the
 * markup into real React elements – substituting Next `<Link>` for internal
 * anchors and Next `<Image>` for absolute image URLs.
 */
export const SafeHtml = ({
  html,
  className,
}: {
  html: string;
  className?: string;
}) => {
  const clean = DOMPurify.sanitize(html, {
    FORBID_ATTR: ["style"],
    FORBID_TAGS: ["script", "style", "iframe", "form", "object", "embed"],
  });

  return <div className={className}>{parse(clean, parserOptions)}</div>;
};
