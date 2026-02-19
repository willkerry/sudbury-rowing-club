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
      className={cn("w-full caption-bottom text-sm", className)}
      ref={ref}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead className={cn("[&_tr]:border-b", className)} ref={ref} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    className={cn("[&_tr:last-child]:border-0", className)}
    ref={ref}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    className={cn(
      "border-t bg-gray-100/50 font-medium last:[&>tr]:border-b-0",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    ref={ref}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    className={cn("mt-4 text-gray-500 text-sm", className)}
    ref={ref}
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
  const sortIcon = {
    asc: <ArrowUp aria-hidden className="h-3.5 w-3.5" />,
    desc: <ArrowDown aria-hidden className="h-3.5 w-3.5" />,
    none: <ChevronsUpDown aria-hidden className="h-3.5 w-3.5" />,
  }[column.getIsSorted() || "none"];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div>{title}</div>

      {column.getCanSort() && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="px-1"
              size="xs"
              variant={column.getIsSorted() ? "tertiary" : "ghost"}
            >
              {sortIcon}
              <span className="sr-only">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              disabled={column.getIsSorted() === "asc"}
              onClick={() => column.toggleSorting(false)}
            >
              <ArrowUp aria-hidden className="h-3.5 w-3.5" />
              Ascending
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={column.getIsSorted() === "desc"}
              onClick={() => column.toggleSorting(true)}
            >
              <ArrowDown aria-hidden className="h-3.5 w-3.5" />
              Descending
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={!column.getIsSorted()}
              onClick={() => column.clearSorting()}
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
            <Button
              className="px-1"
              size="xs"
              variant={column.getIsFiltered() ? "tertiary" : "ghost"}
            >
              <Search aria-hidden className="h-3.5 w-3.5" />
              <span className="sr-only">Filter {title}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" asChild>
            <DropdownMenuItem asChild>
              <Input
                aria-label={`Filter by ${title}`}
                onChange={(event) => column.setFilterValue(event.target.value)}
                type="text"
                value={String(column.getFilterValue() ?? "")}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
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
