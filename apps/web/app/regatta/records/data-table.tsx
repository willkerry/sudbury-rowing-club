"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  type RowData,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import {
  createParser,
  parseAsIndex,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type RecordsTableFeatures, recordsTableFeatures } from "./features";

interface DataTableProps<TData extends RowData> {
  readonly columns: ColumnDef<RecordsTableFeatures, TData>[];
  readonly data: TData[];
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

const parseAsColumnFiltersState = createParser<ColumnFiltersState>({
  eq: isSameState,
  parse: (value) =>
    value
      .split(",")
      .filter(Boolean)
      .map((item) => {
        const [id, value] = item.split(":");
        return { id, value };
      }),
  serialize: (value) =>
    value.map((item) => `${item.id}:${item.value}`).join(","),
});

const NO_SORTING: SortingState = [];
const NO_COLUMN_FILTERS: ColumnFiltersState = [];

const DataTableWithoutSuspense = <TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useQueryState(
    "sorting",
    parseAsSortingState.withDefault(NO_SORTING),
  );

  const [columnFilters, setColumnFilters] = useQueryState(
    "columnFilters",
    parseAsColumnFiltersState.withDefault(NO_COLUMN_FILTERS),
  );

  const [currentPage, setCurrentPage] = useQueryStates({
    pageIndex: parseAsIndex.withDefault(0),
    pageSize: parseAsIndex.withDefault(10),
  });

  const table = useTable({
    features: recordsTableFeatures,
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setCurrentPage,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
      pagination: currentPage,
    },
  });

  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-lg) rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.column.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
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
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center gap-2 space-x-2 py-4 select-none">
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          size="sm"
          variant="ghost"
        >
          Previous
        </Button>

        <span className="flex items-center gap-1 text-sm text-gray-500 tabular-nums">
          Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
        </span>

        <Button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          size="sm"
          variant="ghost"
        >
          Next
        </Button>
      </div>
    </>
  );
};

export const DataTable = <TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) => (
  <Suspense fallback={<div>Loading...</div>}>
    <DataTableWithoutSuspense columns={columns} data={data} />
  </Suspense>
);
