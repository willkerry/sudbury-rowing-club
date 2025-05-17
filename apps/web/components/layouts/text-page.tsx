import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Text from "@/components/stour/text";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

/**
 * A 'root'-level comonent for rendering simple pages with a title and some
 * HTML-like content. **Do not** wrap this component in a `Layout` component.
 */
const TextPage = ({
  children,
  title,
  color,
  prose = "prose",
  font,
  className,
}: {
  title: string;
  children: React.ReactNode;
  color?: ComponentProps<typeof HeroTitle>["color"];
  prose?: "max-w-prose" | "prose" | false;
  font?: ComponentProps<typeof Text>["font"];
  className?: Parameters<typeof cn>[0];
}) => (
  <>
    <HeroTitle title={title} prose={!!prose} breadcrumbs {...{ color }} />
    <Container>
      <Text
        className={cn("mx-auto mt-8 mb-16 sm:my-16", prose, className)}
        font={font}
      >
        {children}
      </Text>
    </Container>
  </>
);

export default TextPage;
