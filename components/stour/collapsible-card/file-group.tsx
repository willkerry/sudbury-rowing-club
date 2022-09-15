import Link from "@/components/stour/link";
import { type FileGroupProps } from "./collapsible-card";

const FileGroup = ({ fileItems }: FileGroupProps) => (
  <div className="space-y-4">
    {fileItems.map(
      (item, i) =>
        item.documents && (
          <div key={i} className="flex flex-col">
            {item.title && (
              <h3 className="font-medium text-gray-700">{item.title}</h3>
            )}
            {item.documents.map((doc) => (
              <Link key={doc._key} href={`${doc.url}?dl=`} download>
                {doc.title}
              </Link>
            ))}
          </div>
        )
    )}
  </div>
);

export default FileGroup;
