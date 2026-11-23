import { Breadcrumbs } from "@/components/stour/breadcrumbs";

export const DocPageHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <header className="relative">
    <div className="mt-0.5 space-y-2.5">
      <div className="h-5">
        <Breadcrumbs
          activeItemClassName="whitespace-nowrap font-medium text-gray-900"
          currentLabel={title}
          inactiveItemClassName="capitalize text-gray-500 hover:text-gray-900 transition after:content-['→'] after:px-2 after:text-gray-400 capitalize transition"
          listClassName="flex not-prose text-sm font-medium "
        />
      </div>
      <div className="flex items-center">
        <h1 className="inline-block text-2xl font-bold text-gray-900 sm:text-3xl">
          {title}
        </h1>
      </div>

      {description && (
        <div className="prose mt-2 text-lg prose-gray">
          <p>{description}</p>
        </div>
      )}
    </div>
  </header>
);
