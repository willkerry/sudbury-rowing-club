import type { Notice } from "@sudburyrc/api";
import { Link } from "@/components/stour/link";

type FileGroupProps = {
  fileItems: Notice["documents"];
};

export const FileGroup = ({ fileItems }: FileGroupProps) => {
  if (!fileItems) return null;

  return (
    <div className="space-y-4">
      {fileItems.map(({ _key, title, documents }) => (
        <div key={_key} className="flex flex-col">
          {title && <h3 className="font-medium text-gray-700">{title}</h3>}

          {documents.map(({ _key, url, title }) => (
            <Link key={_key} href={`${url}?dl=`} download>
              {title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};
