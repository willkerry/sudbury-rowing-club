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
    hero: string;
    item: string;
  }
>([
  [
    "blue",
    {
      container: "bg-blue-50",
      hero: "bg-blue-900 text-blue-50",
      item: "text-blue-500 hover:text-blue-300",
    },
  ],
  [
    "gray",
    {
      container: "bg-gray-50",
      hero: "bg-gray-900 text-gray-50",
      item: "text-gray-500 hover:text-gray-300",
    },
  ],
  [
    "transparent",
    {
      container: "bg-transparent",
      hero: "bg-transparent text-gray-900",
      item: "text-gray-800 hover:text-gray-600",
    },
  ],
]);

const HeroTitle: React.FC<Props> = ({
  title,
  children,
  prose = false,
  breadcrumbs = false,
  color = "blue",
  transparent = false,
}) => {
  let localColor = color;
  if (transparent) localColor = "transparent";

  const colorClasses = COLOR_MAP.get(localColor);

  return (
    <>
      <div
        className={cn(
          "relative flex h-48 min-h-[48] flex-wrap content-center",
          colorClasses?.hero
        )}
      >
        <Container>
          <div className={cn(prose && "mx-auto max-w-prose text-center")}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>
            {children}
          </div>
        </Container>
      </div>
      {breadcrumbs && (
        <div className={cn("py-2", colorClasses?.container)}>
          <Container>
            <Breadcrumbs
              listClassName={cn(
                "flex text-sm",
                prose && "max-w-min mx-auto justify-center"
              )}
              rootLabel="Home"
              inactiveItemClassName={cn(
                "whitespace-nowrap after:content-['→'] after:px-2 after:text-gray-400 capitalize transition",
                colorClasses?.item
              )}
              activeItemClassName="whitespace-nowrap font-medium capitalize"
            />
          </Container>
        </div>
      )}
    </>
  );
};

export default HeroTitle;
