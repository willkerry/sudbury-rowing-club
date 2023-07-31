import { cva } from "class-variance-authority";
import cn from "clsx";
import useNotice, { noticeVariants } from "@/hooks/useNotice";
import { useEffect, useRef, useState } from "react";
import Text from "../stour/text";
import DateFormatter from "../utils/date-formatter";
import Container from "../layouts/container";

const bannerVariants = cva(noticeVariants, {
  variants: {
    bg: {
      primary: "bg-blue-700",
      secondary: "bg-black",
      success: "bg-green-800",
      warning: "bg-amber-500",
      error: "bg-red-700",
    },
    text: {
      primary: "text-blue-50",
      secondary: "text-gray-200",
      success: "text-green-200",
      warning: "text-gray-950",
      error: "text-red-50",
    },
    textHover: {
      primary: "group-hover:text-blue-200",
      secondary: "group-hover:text-blue-300",
      success: "group-hover:text-green-400",
      warning: "group-hover:text-yellow-900",
      error: "group-hover:text-red-300",
    },
  },
});

type BaseButtonOrAnchorProps = {
  className?: string;
  children: React.ReactNode;
};

type ButtonOrAnchorProps =
  | (BaseButtonOrAnchorProps & {
      type: "button";
      onClick?: () => void;
    })
  | (BaseButtonOrAnchorProps & {
      type: "a";
      href: string;
    });

const ButtonOrAnchor = ({
  type,
  className,
  children,
  ...props
}: ButtonOrAnchorProps) =>
  ({
    button: (
      <button type="button" className={className} {...props}>
        {children}
      </button>
    ),
    a: (
      <a
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
  }[type]);

const Banner = () => {
  const { data, error } = useNotice();
  const textRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setExpanded(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (error || !data || !data.display) return null;

  const controlTypes = ["button", "a"] as const;
  const controlType: (typeof controlTypes)[number] = (() => {
    if (data.link?.match(/^(https?|mailto):\/\//)) return "a";
    if (data.link?.match(/^\/[a-z0-9-]+/)) return "a";
    return "button";
  })();

  const controlVariants: Record<
    (typeof controlTypes)[number],
    {
      text: string;
      className: string;
    }
  > = {
    button: {
      text: "Read more",
      className: cn([
        "group-hover:rotate-90",
        expanded && "rotate-90 group-hover:-rotate-90",
      ]),
    },
    a: {
      text: "Go",
      className: "group-hover:translate-x-0.5",
    },
  };

  const { text, className } = controlVariants[controlType];

  return (
    <>
      <ButtonOrAnchor
        className={cn(
          "group z-50 flex w-full items-center py-2 text-sm",
          bannerVariants({ bg: data?.type, text: data?.type }),
          expanded && "shadow-2xl"
        )}
        type={controlType}
        href={data.link || "#"}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Container className="text-left">
          <span className="font-semibold">{data?.label}</span>{" "}
          <span
            className={cn(bannerVariants({ textHover: data?.type }), "ml-1")}
          >
            {text}{" "}
            <span
              className={cn(
                "inline-block transform transition-transform",
                className
              )}
            >
              &rarr;
            </span>
          </span>
        </Container>
      </ButtonOrAnchor>

      {!data.link && (
        <div
          className="absolute z-40 w-full overflow-hidden bg-gray-50 shadow transition-all duration-500"
          style={{ maxHeight: expanded ? textRef.current?.scrollHeight : 0 }}
          aria-hidden={!expanded}
        >
          <div ref={textRef} className="h-full">
            <Container>
              <Text portableText={data?.text} size="small" className="py-4" />

              {data.date && (
                <div className="mb-4 text-xs font-medium text-gray-700">
                  Updated <DateFormatter dateString={data.date} />
                </div>
              )}
            </Container>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
