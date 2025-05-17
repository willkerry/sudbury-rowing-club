import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { MDXContent as BaseMDXContent } from "@content-collections/mdx/react";
import Link from "next/link";
import type { ComponentProps } from "react";

export const MDXContent = ({
  components,
  ...props
}: ComponentProps<typeof BaseMDXContent>) => (
  <BaseMDXContent
    {...props}
    components={{
      ...components,
      a: Link,
      Callout: ({ children, type, ...props }) => (
        <Alert variant={type || "default"} {...props}>
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      ),
      mark: ({ className, ...props }) => (
        <mark
          className={cn("rounded-xs bg-blue-100 px-px text-black", className)}
          {...props}
        />
      ),
    }}
  />
);
