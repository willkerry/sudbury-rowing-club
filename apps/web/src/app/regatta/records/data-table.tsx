"use client";

import {
  IconArrowDown,
  IconArrowUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  type ColumnDef,
  flexRender,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  createParser,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { type MouseEvent, Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { inputVariants } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { detectCourseLength } from "./[event]/format-description";
import { unpickCompositeCrewClubs } from "./[event]/utils";
import { type RecordsTableFeatures, recordsTableFeatures } from "./features";
import type { Record } from "./transformRecords";

interface RecordsTableProps {
  readonly columns: ColumnDef<RecordsTableFeatures, Record>[];
  readonly data: Record[];
}

const isSameState = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

const parseAsSortingState = createParser<SortingState>({
  eq: isSameState,
  parse: (value) =>
    value
      .split(",")
      .filter(Boolean)
      .map((item) => {
        const [id, desc] = item.split(":");
        return {
          id,
          desc: desc === "desc",
        };
      }),
  serialize: (value) =>
    value.map((item) => `${item.id}:${item.desc ? "desc" : "asc"}`).join(","),
});

const NO_SORTING: SortingState = [];
const COURSES = ["all", "350", "650"] as const;

const normalise = (value: string) =>
  value.toLowerCase().replaceAll("×", "x").replaceAll("−", "-").trim();

const toSearchText = (record: Record) =>
  normalise(
    [
      record.event,
      record.club,
      record.year.getFullYear(),
      ...unpickCompositeCrewClubs(record.parsedClub),
    ].join(" "),
  );

const RecordsTableWithoutSuspense = ({ columns, data }: RecordsTableProps) => {
  const [sorting, setSorting] = useQueryState(
    "sorting",
    parseAsSortingState.withDefault(NO_SORTING),
  );
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [course, setCourse] = useQueryState(
    "course",
    parseAsStringLiteral(COURSES).withDefault("all"),
  );

  const searchable = useMemo(
    () => data.map((record) => ({ record, text: toSearchText(record) })),
    [data],
  );

  const filtered = useMemo(() => {
    const terms = normalise(query).split(/\s+/).filter(Boolean);

    return searchable
      .filter(
        ({ record, text }) =>
          (course === "all" || detectCourseLength(record) === Number(course)) &&
          terms.every((term) => text.includes(term)),
      )
      .map(({ record }) => record);
  }, [searchable, query, course]);

  const table = useTable({
    features: recordsTableFeatures,
    data: filtered,
    columns,
    onSortingChange: setSorting,
    state: { sorting },
  });

  const router = useRouter();
  const rows = table.getRowModel().rows;
  const isFiltered = query !== "" || course !== "all";

  const openRecord = (event: MouseEvent, href: string) => {
    const target = event.target as Element;

    if (
      event.button === 2 ||
      target.closest("a, button") ||
      window.getSelection()?.toString()
    ) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.button === 1) {
      window.open(href, "_blank", "noopener");

      return;
    }

    router.push(href);
  };

  const clearFilters = () => {
    void setQuery(null);
    void setCourse(null);
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
          />
          <input
            aria-label="Search records"
            autoComplete="off"
            className={cn(
              inputVariants(),
              "pl-9 [&::-webkit-search-cancel-button]:hidden",
            )}
            enterKeyHint="search"
            onChange={(event) => void setQuery(event.target.value || null)}
            onKeyDown={(event) => {
              if (event.key === "Escape") void setQuery(null);
            }}
            placeholder="Search by event, club or year"
            spellCheck={false}
            type="search"
            value={query}
          />
        </div>

        <Tabs
          onValueChange={(value) =>
            void setCourse(value === "all" ? null : value)
          }
          value={course}
        >
          <TabsList aria-label="Course" className="w-full sm:w-auto">
            <TabsTrigger className="flex-1" value="all">
              All courses
            </TabsTrigger>
            <TabsTrigger className="flex-1 tabular-nums" value="350">
              350 m
            </TabsTrigger>
            <TabsTrigger className="flex-1 tabular-nums" value="650">
              650 m
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-sm border">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  const sorted = column.getIsSorted();
                  const label = flexRender(
                    column.columnDef.header,
                    header.getContext(),
                  );

                  return (
                    <TableHead
                      aria-sort={
                        column.getCanSort()
                          ? sorted
                            ? `${sorted}ending`
                            : "none"
                          : undefined
                      }
                      className={cn(
                        "h-10 px-3 text-xs sm:px-4",
                        column.columnDef.meta?.className,
                      )}
                      key={header.id}
                    >
                      {column.getCanSort() ? (
                        <button
                          className={cn(
                            "-mx-1.5 inline-flex items-center gap-1 rounded-sm px-1.5 py-1 transition-colors hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:outline-none active:bg-gray-200",
                            sorted && "text-gray-900",
                            column.id === "time" && "flex-row-reverse",
                          )}
                          onClick={column.getToggleSortingHandler()}
                          type="button"
                        >
                          {label}
                          {sorted === "asc" && (
                            <IconArrowUp aria-hidden className="size-3.5" />
                          )}
                          {sorted === "desc" && (
                            <IconArrowDown aria-hidden className="size-3.5" />
                          )}
                          {!sorted && (
                            <IconSelector
                              aria-hidden
                              className="size-3.5 text-gray-300"
                            />
                          )}
                        </button>
                      ) : (
                        label
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  className="cursor-pointer hover:bg-gray-50 active:bg-gray-100 active:transition-none"
                  key={row.id}
                  onAuxClick={(event) =>
                    openRecord(event, `/regatta/records/${row.original.slug}`)
                  }
                  onClick={(event) =>
                    openRecord(event, `/regatta/records/${row.original.slug}`)
                  }
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell
                      className={cn(
                        "px-3 py-3 sm:px-4",
                        cell.column.columnDef.meta?.className,
                      )}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  className="py-12 text-center"
                  colSpan={columns.length}
                >
                  <p className="text-gray-600">No records match your search.</p>
                  <Button
                    className="mt-3"
                    onClick={clearFilters}
                    size="sm"
                    variant="secondary"
                  >
                    Clear filters
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p aria-live="polite" className="mt-3 text-sm text-gray-500 tabular-nums">
        {isFiltered
          ? `${rows.length} of ${data.length} records`
          : `${data.length} records`}
      </p>
    </>
  );
};

export const DataTable = (props: RecordsTableProps) => (
  <Suspense>
    <RecordsTableWithoutSuspense {...props} />
  </Suspense>
);
