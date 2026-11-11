import { blue } from "@sudburyrc/blue";
import { cva, type VariantProps } from "class-variance-authority";
import { useId } from "react";
import { cn } from "@/lib/utils";

const variants = cva(
  cn([
    "absolute top-1/2 left-1/2 -z-10 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0",
  ]),
  {
    defaultVariants: {
      size: "md",
    },
    variants: {
      size: {
        lg: "h-[68rem] w-[68rem]",
        md: "h-[64rem] w-[64rem]",
        sm: "h-[32rem] w-[32rem]",
      },
    },
  },
);

export const HundredAndFiftyGradient = ({
  size,
}: VariantProps<typeof variants>) => {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={variants({ size })}
      viewBox="0 0 1024 1024"
    >
      <circle
        cx="512"
        cy="512"
        fill={`url(#${id})`}
        fillOpacity="0.7"
        r="512"
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
