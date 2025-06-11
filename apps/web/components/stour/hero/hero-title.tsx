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
    <div className="bg-blue-950">
      <Container>
        <header className="relative space-y-2.5">
          <div
            className={cn("pt-6 pb-3 sm:py-10", {
              "text-center": prose,
            })}
          >
            <h1 className="font-bold text-3xl text-blue-50 sm:text-5xl">
              {title}
            </h1>

            <div className="h-5">
              {breadcrumbs && (
                <div
                  className={cn("mt-3", {
                    "ml-0.5": !prose,
                    "mx-auto max-w-min": prose,
                  })}
                >
                  <Breadcrumbs
                    listClassName="not-prose flex font-medium text-sm"
                    currentLabel={title}
                    inactiveItemClassName="text-blue-200 hover:text-blue-50 transition after:content-['→'] after:px-2 after:text-white after:opacity-50 capitalize transition"
                    activeItemClassName="whitespace-nowrap font-medium text-blue-50"
                  />
                </div>
              )}
            </div>
          </div>

          {description && (
            <div className="prose prose-gray mt-2 text-lg">
              <p>{smartQuotes(description)}</p>
            </div>
          )}
        </header>
      </Container>
    </div>
  );
};

export default HeroTitle;
