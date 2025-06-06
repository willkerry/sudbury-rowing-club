import { smartQuotes } from "@sudburyrc/helpers";
import Container from "../../layouts/container";

import { cn } from "@/lib/utils";
import Breadcrumbs from "../breadcrumbs";

interface BaseProps {
  title: string;
  description?: string;
  prose?: boolean;
  breadcrumbs?: boolean;
}

const HeroTitle = ({
  title,
  description,
  prose = false,
  breadcrumbs = false,
}: BaseProps) => {
  return (
    <Container>
      <header className="relative space-y-2.5">
        <div className="h-5">
          {breadcrumbs && (
            <Breadcrumbs
              listClassName="flex not-prose text-sm font-medium "
              currentLabel={title}
              inactiveItemClassName="capitalize text-gray-500 hover:text-gray-900 transition after:content-['→'] after:px-2 after:text-gray-400 capitalize transition"
              activeItemClassName="whitespace-nowrap font-medium text-gray-900"
            />
          )}
        </div>

        <div
          className={cn("pt-6 pb-3 sm:py-10", {
            "text-center": prose,
          })}
        >
          <h1 className="font-bold text-3xl text-gray-900 sm:text-5xl">
            {title}
          </h1>
        </div>

        {description && (
          <div className="prose prose-gray mt-2 text-lg">
            <p>{smartQuotes(description)}</p>
          </div>
        )}
      </header>
    </Container>
  );
};

export default HeroTitle;
