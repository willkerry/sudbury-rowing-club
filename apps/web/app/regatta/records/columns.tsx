"use client";

import type { ColumnDef } from "@tanstack/react-table";
import NextLink from "next/link";
import { Fragment } from "react";
import { Blade } from "@/components/stour/blade";
import {
  detectAndFormatCourseLength,
  detectCourseLength,
} from "./[event]/format-description";
import { unpickCompositeCrewClubs } from "./[event]/utils";
import type { RecordsTableFeatures } from "./features";
import { formatDuration, type Record, slugify } from "./transformRecords";

const toSeconds = ({ minutes, seconds }: Record["time"]) =>
  minutes * 60 + seconds;

export const columns: ColumnDef<RecordsTableFeatures, Record>[] = [
  {
    accessorKey: "event",
    enableSorting: false,
    header: "Event",
    cell: ({ row }) => (
      <>
        <NextLink
          className="font-medium text-gray-900 outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-gray-950 focus-visible:after:ring-inset"
          href={`/regatta/records/${slugify(row.original.event)}`}
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
    sortDescFirst: false,
    header: "Time",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900 tabular-nums">
        {formatDuration(row.original.time)}
      </span>
    ),
    sortFn: (a, b) =>
      toSeconds(a.original.time) - toSeconds(b.original.time) ||
      a.original.year.getFullYear() - b.original.year.getFullYear(),
  },
];
