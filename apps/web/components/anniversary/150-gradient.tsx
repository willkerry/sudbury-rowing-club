import { useId } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { blue } from "@sudburyrc/blue";
import { cn } from "@/lib/utils";

const variants = cva(
  cn([
    "absolute left-1/2 top-1/2 -z-10 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0",
  ]),
  {
    variants: {
      size: {
        sm: "h-[32rem] w-[32rem]",
        md: "h-[64rem] w-[64rem]",
        lg: "h-[68rem] w-[68rem]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const HundredAndFiftyGradient = ({
  size,
}: VariantProps<typeof variants>) => {
  const id = useId();

  return (
    <svg
      viewBox="0 0 1024 1024"
      className={variants({ size })}
      aria-hidden="true"
    >
      <circle
        cx="512"
        cy="512"
        r="512"
        fill={`url(#${id})`}
        fillOpacity="0.7"
      />
      <defs>
        <radialGradient id={id}>
          <stop stopColor={blue[500]} />
          <stop offset="1" stopColor={blue[700]} />
        </radialGradient>
      </defs>
    </svg>
  );
};
