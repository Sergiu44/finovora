import {
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  getExpandedRowModel,
  type ExpandedState,
  type RowSelectionState,
} from "@tanstack/react-table";
import React, { Fragment, useMemo, useState } from "react";
import { type BaseCategory } from "../../actions/categories";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { ChevronDown, ChevronDownIcon, ChevronRightIcon, EditIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import TableCategoriesCreateRow from "./TableCategoriesCreateRow";
import EditCategoryDialog from "./EditCategoryDialog";

export default function TableCategories({
  data,
  setRowSelection,
  rowSelection,
}: {
  data: BaseCategory[];
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  rowSelection: RowSelectionState;
}) {
  const [selectedCategory, setSelectedCategory] = useState<{ name: string; id: string } | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const columns: ColumnDef<BaseCategory>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="pl-3">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(e) => table.toggleAllPageRowsSelected(!!e)}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className={`flex items-center pl-${row.depth ? 8 : 3} max-w-0`}>
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(e) => row.toggleSelected(!!e)} />
          </div>
        ),
      },
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 2,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <EditIcon size="16" onClick={() => setSelectedCategory({ id: row.original.id, name: row.original.name })} />
            {row.depth < 1 && (
              <div className={`pr-${row.depth * 2}`}>
                <Button className="pl-0!" variant="link" onClick={() => row.toggleExpanded()}>
                  {row.getIsExpanded() ? <ChevronDownIcon size="24" /> : <ChevronRightIcon size="24" />}
                </Button>
              </div>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getSubRows: (row) => row.subCategories,
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => String(row.id),
    onExpandedChange: setExpanded,
    state: {
      expanded,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="bg-bg-main-light" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="py-3" key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <TableRow data-state={(row.getIsSelected() || row.getIsExpanded()) && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="py-3" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {row.getIsExpanded() && row.depth === 0 && (
                <TableCategoriesCreateRow parentCategoryId={row.original.id} columns={columns} />
              )}
            </Fragment>
          ))}
          <TableCategoriesCreateRow columns={columns} />
        </TableBody>
      </Table>

      {selectedCategory && <EditCategoryDialog category={selectedCategory} onClose={() => setSelectedCategory(null)} />}
    </div>
  );
}
