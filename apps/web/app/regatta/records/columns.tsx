"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@/components/stour/link";
import { DataTableColumnHeader } from "@/components/ui/table";
import { detectAndFormatCourseLength } from "./[event]/format-description";
import { getBladeUrls } from "./[event]/utils";
import { Blade } from "./blade";
import { formatDuration, type Record, slugify } from "./transformRecords";

export const columns: ColumnDef<Record>[] = [
  {
    accessorKey: "course",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course" />
    ),
    cell: ({ row }) => detectAndFormatCourseLength(row.original),
  },
  {
    accessorKey: "event",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event" />
    ),
  },
  {
    accessorKey: "year",
    cell: ({ row }) => (
      <div className="disambiguate tabular-nums">
        {row.original.year.getFullYear()}
      </div>
    ),
    sortingFn: (a, b) =>
      a.original.year.getFullYear() - b.original.year.getFullYear(),
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Club" />
    ),
    accessorKey: "club",
    cell: ({ row }) => {
      const blades = getBladeUrls(row.original.club, true);

      return (
        <div className="flex flex-row gap-2">
          {blades.length > 0 && (
            <div className="flex flex-row items-center gap-2">
              {blades.map((blade) => (
                <Blade key={blade} src={blade} alt="" />
              ))}
            </div>
          )}
          <div className="uppercase tracking-wider">{row.original.club}</div>
        </div>
      );
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    sortingFn: (a, b) => {
      const aTimeSeconds =
        a.original.time.minutes * 60 + a.original.time.seconds;
      const bTimeSeconds =
        b.original.time.minutes * 60 + b.original.time.seconds;

      const aYear = a.original.year.getFullYear();
      const bYear = b.original.year.getFullYear();

      if (aTimeSeconds === bTimeSeconds) {
        return aYear - bYear;
      }

      return aTimeSeconds - bTimeSeconds;
    },
    enableSorting: true,
    accessorKey: "time",
    cell: ({ row }) => (
      <div className="tabular-nums tracking-wider">
        {formatDuration(row.original.time)}
      </div>
    ),
  },
  {
    id: "link",
    header: "Link",
    cell: ({ row }) => (
      <Link href={`/regatta/records/${slugify(row.original.event)}`}>View</Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
