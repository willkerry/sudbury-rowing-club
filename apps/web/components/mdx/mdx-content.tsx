import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { MDXContent as BaseMDXContent } from "@content-collections/mdx/react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const MDXContent = ({
  components,
  ...props
}: ComponentProps<typeof BaseMDXContent>) => (
  <BaseMDXContent
    {...props}
    components={{
      ...components,
      Callout: ({ children, type, ...props }) => (
        <Alert variant={type ? type : "default"} {...props}>
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      ),
      mark: ({ className, ...props }) => (
        <mark
          className={cn("bg-blue-100 px-px rounded-sm text-black", className)}
          {...props}
        />
      ),
    }}
  />
);
