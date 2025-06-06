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
  prose = "prose",
  font,
  className,
}: {
  title: string;
  children: React.ReactNode;
  prose?: "max-w-prose" | "prose" | false;
  font?: ComponentProps<typeof Text>["font"];
  className?: Parameters<typeof cn>[0];
}) => (
  <>
    <HeroTitle title={title} breadcrumbs />
    <Container>
      {prose === "prose" ? (
        <Text className={cn("mt-8 mb-16 sm:my-16", className)} font={font}>
          {children}
        </Text>
      ) : (
        <div className={cn("mt-8 mb-16 sm:my-16", prose, className)}>
          {children}
        </div>
      )}
    </Container>
  </>
);

export default TextPage;
