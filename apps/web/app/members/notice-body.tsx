import type { Notice } from "@sudburyrc/api";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/stour/label";
import { Text } from "@/components/stour/text";
import { DateFormatter } from "@/components/utils/date-formatter";
import { FileGroup } from "./file-group";

export const NoticeBody = ({ notice }: { notice: Notice }) => {
  const splitItemCount = Math.ceil((notice.documents?.length ?? 2) / 2);

  if (!notice) return null;

  return (
    <>
      {notice.body && <Text className="p-4" portableText={notice.body} />}

      {notice.meta && (
        <div className="flex bg-gray-50 py-2.5 text-sm">
          {notice.meta.map((item) => (
            <div className="px-4" key={item._key}>
              <Label className="select-none text-xs">{`${item.label}: `}</Label>
              <span className="disambiguate font-medium text-gray-800! text-xs">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {notice.documents && (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          <FileGroup fileItems={notice.documents.slice(0, splitItemCount)} />
          <FileGroup fileItems={notice.documents.slice(splitItemCount)} />
        </div>
      )}

      <div className="flex justify-between gap-4 px-4 py-3 font-medium text-gray-500 text-xs">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>
            Created:{" "}
            <DateFormatter
              className="disambiguate text-gray-700"
              dateString={notice._createdAt}
              format="short"
            />
          </span>
          <span>
            Updated:{" "}
            <DateFormatter
              className="disambiguate text-gray-700"
              dateString={notice._updatedAt}
              format="time"
            />
          </span>
        </div>

        <Link
          className="transition-colors hover:text-black"
          href={`../members/${notice.slug}`}
        >
          <span className="sr-only">Open permalink</span>
          <LinkIcon aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
};
