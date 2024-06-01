import cn from "clsx";
import Container from "../../layouts/container";
import Breadcrumbs from "../breadcrumbs";

interface Props {
  title: string;
  children?: React.ReactNode;
  prose?: boolean;
  breadcrumbs?: boolean;
  color?: "blue" | "gray" | "transparent";
  /** @deprecated */
  transparent?: boolean;
}

const COLOR_MAP = new Map<
  NonNullable<Props["color"]>,
  {
    container: string;
    heading: string;
    hero: string;
    item: string;
  }
>([
  [
    "blue",
    {
      container: "bg-blue-50",
      heading: "font-bold",
      hero: "bg-blue-900 text-blue-50",
      item: "text-blue-500 hover:text-blue-300",
    },
  ],
  [
    "gray",
    {
      container: "border-b bg-gray-100",
      heading: "font-semibold",
      hero: "bg-gray-900 text-gray-50",
      item: "text-gray-500 hover:text-gray-300",
    },
  ],
  [
    "transparent",
    {
      container: "bg-gray-50 border",
      heading: "font-semibold",
      hero: "bg-transparent text-gray-900",
      item: "text-gray-800 hover:text-gray-600 transition hover:text-blue-500",
    },
  ],
]);

const HeroTitle = ({
  title,
  children,
  prose = false,
  breadcrumbs = false,
  color = "blue",
  transparent = false,
}: Props) => {
  // For back compatibility with the old `transparent` prop
  const localColor = transparent ? "transparent" : color;

  const colorClasses = COLOR_MAP.get(localColor);

  return (
    <>
      <div
        className={cn(
          "relative flex h-48 min-h-[48] flex-wrap content-center",
          colorClasses?.hero,
        )}
      >
        <Container>
          <div className={cn(prose && "mx-auto max-w-prose text-center")}>
            <h1
              className={cn(
                "text-4xl md:text-6xl sm:text-5xl",
                colorClasses?.heading,
              )}
            >
              {title}
            </h1>
            {children}
          </div>
        </Container>
      </div>
      {breadcrumbs && (
        <div
          className={cn(
            "py-2",
            colorClasses?.container,
            prose && color === "transparent"
              ? "mx-auto w-min rounded-full border"
              : "border-y",
          )}
        >
          <Container>
            <Breadcrumbs
              listClassName={cn(
                "flex text-sm",
                prose && "max-w-min mx-auto justify-center",
              )}
              rootLabel="Home"
              inactiveItemClassName={cn(
                "whitespace-nowrap after:content-['→'] after:px-2 after:text-gray-400 capitalize transition",
                colorClasses?.item,
                prose && color === "transparent" && "mx-auto",
              )}
              activeItemClassName="whitespace-nowrap font-medium capitalize"
              currentLabel={title}
            />
          </Container>
        </div>
      )}
    </>
  );
};

export default HeroTitle;
