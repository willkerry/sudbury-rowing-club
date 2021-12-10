import Container from "../components/container";
import cn from "classnames";
/* import Breadcrumbs from "nextjs-breadcrumbs"; */
import Breadcrumbs from "./stour/breadcrumbs";

export default function HeroTitle({
  title,
  children,
  prose,
  breadcrumbs,
  transparent,
}) {
  const breadcrumbBanner = (
    <div className="py-2 bg-blue-50">
      <Container>
        <Breadcrumbs
          listClassName={cn(
            "flex text-sm",
            prose && "max-w-min mx-auto justify-center"
          )}
          rootLabel="Home"
          inactiveItemClassName="whitespace-nowrap after:content-['→'] after:px-2 after:text-gray-400 capitalize text-blue-500 hover:text-blue-300 transition"
          activeItemClassName="whitespace-nowrap font-medium capitalize"
        />
      </Container>
    </div>
  );
  return (
    <>
      <div
        className={cn(
          "relative flex flex-wrap content-center h-48 min-h-[48]",
          transparent
            ? "bg-transparent text-gray-900"
            : "bg-blue-900 text-blue-50"
        )}
      >
        <Container>
          <div className={cn(prose && "max-w-prose mx-auto text-center")}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>
            {children}
          </div>
        </Container>
      </div>
      {breadcrumbs && breadcrumbBanner}
    </>
  );
}
