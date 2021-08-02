import Container from "../components/container";
import cn from "classnames";
import Breadcrumbs from "nextjs-breadcrumbs";

export default function HeroTitle({ title, children, prose, breadcrumbs }) {
  const breadcrumbBanner = (
    <div className="py-2 bg-blue-50">
      <Container>
        <Breadcrumbs
          listClassName={cn("flex text-sm", prose && "max-w-min mx-auto")}
          rootLabel="Home"
          inactiveItemClassName="after:content-['→'] after:px-4 after:text-gray-400 after:font-serif capitalize text-blue-500 hover:text-blue-300 transition"
          activeItemClassName="font-medium capitalize"
        />
      </Container>
    </div>
  );
  return (
    <>
      <div className="relative flex flex-wrap content-center h-48 bg-blue-800 border-t border-b text-blue-50">
        <Container>
          <div className={cn(prose && "max-w-prose mx-auto text-center")}>
            <h1 className="text-6xl font-bold tracking-tight">{title}</h1>

            {children}
          </div>
        </Container>
      </div>
      {breadcrumbs && breadcrumbBanner}
    </>
  );
}
