import { smartQuotes } from "@sudburyrc/helpers";
import { Container } from "@/components/layouts/container";

import { cn } from "@/lib/utils";
import Breadcrumbs from "../breadcrumbs";

type BaseProps = {
  title: string;
  description?: string;
};

type Props =
  | (BaseProps & {
      prose?: true;
      breadcrumbs?: false;
    })
  | (BaseProps & {
      prose?: false;
      breadcrumbs?: true;
    });

export const PageHeader = ({
  title,
  description,
  prose = false,
  breadcrumbs = false,
}: Props) => {
  return (
    <>
      {breadcrumbs && !prose && (
        <div className="relative hidden border-y py-3 sm:block">
          <Container>
            <Breadcrumbs
              listClassName="not-prose flex font-medium text-sm"
              currentLabel={title}
              inactiveItemClassName="text-gray-500 hover:text-gray-900 transition after:content-['→'] after:px-3 after:text-gray-400 capitalize transition"
              activeItemClassName="whitespace-nowrap text-gray-900"
            />
          </Container>
        </div>
      )}

      <Container
        className={cn("my-2 sm:my-10", {
          "text-center": !!prose,
        })}
      >
        <h1 className="font-semibold text-3xl sm:text-5xl">{title}</h1>

        {description && (
          <div
            className={cn(
              "my-t mb-7 max-w-2xl text-gray-600 text-lg sm:my-3.5 sm:text-2xl",
              {
                "mx-auto": !!prose,
              },
            )}
          >
            {smartQuotes(description)}
          </div>
        )}
      </Container>
    </>
  );
};
