import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search, Undo } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { Input } from "./input";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-gray-100/50 font-medium last:[&>tr]:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-gray-500 text-sm", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  // if (!column.getCanSort()) {
  //   return <div className={cn(className)}>{title}</div>;
  // }

  const sortIcon = {
    desc: <ArrowDown aria-hidden className="h-3.5 w-3.5" />,
    asc: <ArrowUp aria-hidden className="h-3.5 w-3.5" />,
    none: <ChevronsUpDown aria-hidden className="h-3.5 w-3.5" />,
  }[column.getIsSorted() || "none"];

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <span>{title}</span>

      <div>
        {column.getCanSort() && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="xs">
                {sortIcon}
                <span className="sr-only">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => column.toggleSorting(false)}
                disabled={column.getIsSorted() === "asc"}
              >
                <ArrowUp aria-hidden className="h-3.5 w-3.5" />
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(true)}
                disabled={column.getIsSorted() === "desc"}
              >
                <ArrowDown aria-hidden className="h-3.5 w-3.5" />
                Descending
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => column.clearSorting()}
                disabled={!column.getIsSorted()}
              >
                <Undo aria-hidden className="h-3.5 w-3.5" />
                Clear
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {column.getCanFilter() && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="xs">
                <Search aria-hidden className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" asChild>
              <DropdownMenuItem asChild>
                {/* if there are fewer than 20 unique values, show a dropdown menu with the values */}
                {column.getFacetedUniqueValues().size < 99999 ? (
                  // <Select
                  //   value={column.getFilterValue() as string}
                  //   onChange={(value) => column.setFilterValue(value)}
                  // >
                  //   {Array.from(column.getFacetedUniqueValues().values())
                  //     .sort()
                  //     .map((value) => (
                  //       <option key={value} value={value}>
                  //         {value}
                  //       </option>
                  //     ))}
                  // </Select>
                  <pre>
                    {JSON.stringify(
                      column.getFacetedUniqueValues().entries(),
                      null,
                      2,
                    )}
                  </pre>
                ) : (
                  <Input
                    type="text"
                    value={column.getFilterValue() as string}
                    onChange={(event) =>
                      column.setFilterValue(event.target.value)
                    }
                  />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  DataTableColumnHeader,
};
