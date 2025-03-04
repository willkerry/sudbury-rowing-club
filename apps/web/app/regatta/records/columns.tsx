"use client";

import Link from "@/components/stour/link";
import { DataTableColumnHeader } from "@/components/ui/table";
import type { ColumnDef } from "@tanstack/react-table";
import { type Record, formatDuration } from "./transformRecords";
import { slugify } from "./transformRecords";

export const columns: ColumnDef<Record>[] = [
  {
    accessorKey: "boat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Boat" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-gray-500">{row.original.boat}</div>
    ),
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
    cell: ({ row }) => (
      <div className="uppercase tracking-wider">{row.original.club}</div>
    ),
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableSorting: false,
    accessorKey: "name",
    cell: ({ row }) => <div className="text-gray-600">{row.original.name}</div>,
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
      <Link href={`/regatta/results/records/${slugify(row.original.event)}`}>
        View
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
