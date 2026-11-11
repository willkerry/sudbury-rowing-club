import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { ScrollLink } from "@/components/utils/scroll-link";
import { cn } from "@/lib/utils";

type LearnToRowCtaProps = {
  to: string;
  variant?: ComponentProps<typeof Button>["variant"];
  children: React.ReactNode;
  title: string;
  buttonText: string;
};

export const LearnToRowCtaSection = ({
  to,
  variant,
  title,
  buttonText,
  children,
}: LearnToRowCtaProps) => (
  <div>
    <p className="text-center">
      <span className="font-medium text-gray-800 text-xl">{title}</span>
      <br />
      <span className="text-gray-500">{children}</span>
    </p>
    <span className="block h-6" />
    <div className="flex justify-center">
      <ScrollLink duration={300} offset={-30} smooth spy to={to}>
        <Button size="lg" variant={variant}>
          {buttonText}
        </Button>
      </ScrollLink>
    </div>
  </div>
);

export const LearnToRowCta = ({
  className,
  ...rest
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "grid gap-12 rounded-sm border bg-gray-50 p-12 md:grid-cols-2",
      className,
    )}
    {...rest}
  />
);
