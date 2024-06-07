// import { NextSeo } from "next-seo";
// import { makeShareImageURL } from "@/lib/og-image";
import { cn } from "@/lib/utils";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";

/**
 * A 'root'-level comonent for rendering simple pages with a title and some
 * HTML-like content. **Do not** wrap this component in a `Layout` component.
 */
const TextPage = ({
  children,
  title,
  description,
  color,
  prose = "prose",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  color?: Parameters<typeof HeroTitle>[0]["color"];
  prose?: "max-w-prose" | "prose" | false;
}) => (
  <>
    {/* <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        images: [{ url: makeShareImageURL(title, true) }],
      }}
    /> */}
    <HeroTitle title={title} prose={!!prose} breadcrumbs {...{ color }} />
    <Container>
      <div className={cn("mx-auto my-16", prose)}>{children}</div>
    </Container>
  </>
);

export default TextPage;
