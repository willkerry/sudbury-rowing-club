import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { MDXContent as BaseMDXContent } from "@content-collections/mdx/react";
import type { ComponentProps } from "react";

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
          className={cn("rounded-sm bg-blue-100 px-px text-black", className)}
          {...props}
        />
      ),
    }}
  />
);
