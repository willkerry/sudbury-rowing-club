"use client";

import type { ColumnDef } from "@tanstack/react-table";
import NextLink from "next/link";
import { Fragment } from "react";
import { Blade } from "@/components/stour/blade";
import { toTotalSeconds } from "@/lib/duration";
import {
  detectAndFormatCourseLength,
  detectCourseLength,
} from "./[event]/format-description";
import { unpickCompositeCrewClubs } from "./[event]/utils";
import type { RecordsTableFeatures } from "./features";
import { formatDuration, type Record } from "./transformRecords";

export const columns: ColumnDef<RecordsTableFeatures, Record>[] = [
  {
    accessorKey: "event",
    enableSorting: false,
    header: "Event",
    cell: ({ row }) => (
      <>
        <NextLink
          className="rounded-xs font-medium text-gray-900 hover:underline focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:outline-none"
          href={`/regatta/records/${row.original.slug}`}
        >
          {row.original.event}
        </NextLink>
        <div className="mt-0.5 text-xs whitespace-nowrap text-gray-500 tabular-nums sm:hidden">
          {detectAndFormatCourseLength(row.original)} ·{" "}
          {row.original.year.getFullYear()}
        </div>
      </>
    ),
  },
  {
    accessorFn: (record) => detectCourseLength(record),
    id: "course",
    meta: { className: "hidden w-24 sm:table-cell" },
    sortFn: "basic",
    header: "Course",
    cell: ({ row }) => (
      <span className="text-gray-500 tabular-nums">
        {detectAndFormatCourseLength(row.original)}
      </span>
    ),
  },
  {
    accessorKey: "club",
    enableSorting: false,
    meta: { className: "sm:w-40" },
    header: "Club",
    cell: ({ row }) => (
      <div
        className="flex flex-wrap items-center gap-x-2 gap-y-1"
        title={unpickCompositeCrewClubs(row.original.parsedClub).join(", ")}
      >
        <div className="flex shrink-0 items-center gap-1">
          {row.original.parsedClub.map((club, index) => (
            <Blade
              key={`${"id" in club ? club.id : club.code}-${index}`}
              src={"id" in club ? club.bladeUrl : null}
            />
          ))}
        </div>
        <span className="uppercase tracking-wider text-gray-700">
          {row.original.club.split("/").map((code, index) => (
            <Fragment key={`${code}-${index}`}>
              {index > 0 && (
                <>
                  /<wbr />
                </>
              )}
              {code}
            </Fragment>
          ))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "year",
    meta: { className: "hidden w-24 sm:table-cell" },
    sortDescFirst: true,
    header: "Year",
    cell: ({ row }) => (
      <span className="disambiguate text-gray-700 tabular-nums">
        {row.original.year.getFullYear()}
      </span>
    ),
    sortFn: (a, b) =>
      a.original.year.getFullYear() - b.original.year.getFullYear(),
  },
  {
    accessorKey: "time",
    meta: { className: "text-right sm:w-24" },
    sortDescFirst: false,
    header: "Time",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 tabular-nums">
        {formatDuration(row.original.time)}
      </span>
    ),
    sortFn: (a, b) =>
      toTotalSeconds(a.original.time) - toTotalSeconds(b.original.time) ||
      a.original.year.getFullYear() - b.original.year.getFullYear(),
  },
];
