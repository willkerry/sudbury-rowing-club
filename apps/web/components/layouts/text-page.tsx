import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import { cn } from "@/lib/utils";

/**
 * A 'root'-level comonent for rendering simple pages with a title and some
 * HTML-like content. **Do not** wrap this component in a `Layout` component.
 */
const TextPage = ({
  children,
  title,
  color,
  prose = "prose",
  className,
}: {
  title: string;
  children: React.ReactNode;
  color?: Parameters<typeof HeroTitle>[0]["color"];
  prose?: "max-w-prose" | "prose" | false;
  className?: Parameters<typeof cn>[0];
}) => (
  <>
    <HeroTitle title={title} prose={!!prose} breadcrumbs {...{ color }} />
    <Container>
      <div className={cn("mx-auto mb-16 mt-8 sm:my-16", prose, className)}>
        {children}
      </div>
    </Container>
  </>
);

export default TextPage;
