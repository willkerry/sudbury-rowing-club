import type { MDXComponents, MDXContent as MDXContentType } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";
import { Declaration } from "@/components/mdx/constitution/declaration";
import { Ins, InsBlock } from "@/components/mdx/constitution/ins";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const Callout = ({
  children,
  type,
  ...props
}: ComponentProps<typeof Alert> & {
  type: "warn" | "destructive" | "success";
}) => (
  <Alert variant={type || "default"} {...props}>
    <AlertDescription>{children}</AlertDescription>
  </Alert>
);

export const MDXContent = ({
  content: Content,
  components,
}: {
  content: MDXContentType;
  components?: MDXComponents;
}) => (
  <Content
    components={{
      ...components,
      a: Link,
      Callout,
      Declaration,
      Ins,
      InsBlock,
      mark: ({ className, ...props }) => (
        <mark
          className={cn("rounded-xs bg-blue-100 px-px text-black", className)}
          {...props}
        />
      ),
    }}
  />
);
