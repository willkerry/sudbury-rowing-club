import { MDXContent as BaseMDXContent } from "@content-collections/mdx/react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { SquadPathways } from "@/components/about/squads/squad-pathways";
import { Text } from "@/components/stour/text";
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
  components,
  ...props
}: ComponentProps<typeof BaseMDXContent>) => (
  <BaseMDXContent
    {...props}
    components={{
      ...components,
      a: Link,
      Callout,
      mark: ({ className, ...props }) => (
        <mark
          className={cn("rounded-xs bg-blue-100 px-px text-black", className)}
          {...props}
        />
      ),
      SquadPathways,
      Text,
    }}
  />
);
