import Container from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
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
  lead = false,
  description,
}: {
  title: string;
  children: React.ReactNode;
  prose?: "max-w-prose" | "prose" | false;
  font?: ComponentProps<typeof Text>["font"];
  className?: Parameters<typeof cn>[0];
  lead?: boolean;
  description?: string;
}) => (
  <>
    <PageHeader title={title} breadcrumbs description={description} />
    <Container>
      {prose === "prose" ? (
        <Text className={cn("mb-16", className)} font={font} lead={lead}>
          {children}
        </Text>
      ) : (
        <div className={cn("mb-16", prose, className, { "auto-lead": lead })}>
          {children}
        </div>
      )}
    </Container>
  </>
);

export default TextPage;
