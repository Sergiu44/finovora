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
import { type BaseCategory } from "../../../../utils/actions/categories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { ChevronDownIcon, ChevronRightIcon, EditIcon } from "lucide-react";
import { Checkbox } from "../../../../components/ui/checkbox";
import TableCategoriesCreateRow from "./TableCategoriesCreateRow";
import CategoryNameInput from "./CategoryNameInput";
import type { TransactionType } from "../../../../types/enums/TransactionTypes";

export default function TableCategories({
  data,
  setRowSelection,
  rowSelection,
  transactionTypeId,
}: {
  data: BaseCategory[];
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  rowSelection: RowSelectionState;
  transactionTypeId: TransactionType;
}) {
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const columns: ColumnDef<BaseCategory>[] = useMemo(
    () => [
      {
        id: "select",
        size: 20,
        maxSize: 20,
        minSize: 20,
        header: ({ table }) => (
          <div className="flex justify-center items-center">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(e) => table.toggleAllPageRowsSelected(!!e)}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div
            className={`flex justify-center items-center ${row.depth > 0 ? "justify-self-end" : ""}`}
          >
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(e) => row.toggleSelected(!!e)}
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 300,
        minSize: 200,
        cell: ({ row }) => {
          const isEditing = editingCategoryId === row.original.id;

          if (isEditing) {
            return (
              <div className={`pl-${row.depth * 4}`}>
                <CategoryNameInput
                  initialValue={row.original.name}
                  categoryId={String(row.original.id)}
                  transactionTypeId={transactionTypeId}
                  onCancel={() => setEditingCategoryId(null)}
                  onSuccess={() => setEditingCategoryId(null)}
                />
              </div>
            );
          }

          return (
            <div
              className={`pl-${row.depth * 4} cursor-pointer select-none`}
              onDoubleClick={() => setEditingCategoryId(row.original.id)}
              title="Double-click to edit"
            >
              {row.original.name}
            </div>
          );
        },
      },
      {
        id: "count",
        header: () => <div className="text-center">No of subcategories</div>,
        size: 50,
        maxSize: 50,
        minSize: 50,
        cell: ({ row }) => {
          const count = row.original?.subCategories?.length || 0;

          // Calculate gradient intensity based on count (0-10+ scale)
          // Higher count = brighter/more intense gradient
          const getBadgeStyles = (count: number) => {
            if (count <= 2)
              return {
                gradient: "bg-gradient-to-r from-primary/10 to-accent/10",
                text: "text-muted-foreground",
                border: "border-muted",
                shadow: "",
              };
            if (count <= 4)
              return {
                gradient: "bg-gradient-to-r from-primary/30 to-accent/30",
                text: "text-accent-800",
                border: "border-primary/40",
                shadow: "",
              };
            if (count <= 6)
              return {
                gradient: "bg-gradient-to-r from-primary/50 to-accent/50",
                text: "text-accent-900",
                border: "border-primary/60",
                shadow: "shadow-sm",
              };
            if (count <= 8)
              return {
                gradient: "bg-gradient-to-r from-primary/70 to-accent/70",
                text: "text-accent-900",
                border: "border-primary/80",
                shadow: "shadow-md shadow-primary/20",
              };
            if (count <= 10)
              return {
                gradient: "bg-gradient-to-r from-primary to-accent",
                text: "text-white",
                border: "border-primary",
                shadow: "shadow-lg shadow-primary/30",
              };
            return {
              gradient: "bg-gradient-to-br from-primary via-accent to-primary",
              text: "text-white",
              border: "border-2 border-accent",
              shadow: "shadow-xl shadow-accent/40",
            }; // 10+
          };

          const badgeStyles = getBadgeStyles(count);

          return (
            count > 0 && (
              <div className="text-center pr-4">
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles.gradient} ${badgeStyles.text} ${badgeStyles.border} ${badgeStyles.shadow} transition-all`}
                >
                  {count}
                </span>
              </div>
            )
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right pr-4">Actions</div>,
        size: 50,
        maxSize: 50,
        minSize: 50,
        cell: ({ row }) => {
          const isEditing = editingCategoryId === row.original.id;

          return (
            <div
              className={`flex items-center justify-end gap-2 ${row.depth > 0 && "pr-9"}`}
            >
              {!isEditing && (
                <EditIcon
                  size="16"
                  className="cursor-pointer"
                  onClick={() => {
                    setEditingCategoryId(row.original.id);
                  }}
                />
              )}
              {row.depth < 1 && (
                <div className={`pr-${row.depth * 2}`}>
                  <Button
                    className="pl-0!"
                    variant="link"
                    onClick={() => row.toggleExpanded()}
                    disabled={isEditing}
                  >
                    {row.getIsExpanded() ? (
                      <ChevronDownIcon size="24" />
                    ) : (
                      <ChevronRightIcon size="24" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [editingCategoryId, transactionTypeId]
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
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    state: {
      expanded,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="rounded-base overflow-hidden border border-input">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="py-3"
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, {
                          ...header.getContext(),
                        })}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {data.map((parentCategory) => {
            const parentRow = table
              .getRowModel()
              .rows.find((r) => r.original.id === parentCategory.id);
            const isExpanded = parentRow?.getIsExpanded() || false;

            return (
              <Fragment key={parentCategory.id}>
                {/* Render parent row */}
                <TableRow
                  data-state={
                    (parentRow?.getIsSelected() ||
                      parentRow?.getIsExpanded()) &&
                    "selected"
                  }
                >
                  {parentRow?.getVisibleCells().map((cell) => (
                    <TableCell
                      className="py-3"
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Render subrows if expanded */}
                {isExpanded &&
                  parentRow?.subRows?.map((subRow) => (
                    <TableRow
                      key={subRow.original.id}
                      data-state={subRow.getIsSelected() && "selected"}
                    >
                      {subRow.getVisibleCells().map((cell) => (
                        <>
                          <TableCell
                            className="py-3"
                            key={cell.id}
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        </>
                      ))}
                    </TableRow>
                  ))}

                {/* Show create button after subrows when parent is expanded */}
                {isExpanded && (
                  <TableCategoriesCreateRow
                    transactionTypeId={transactionTypeId}
                    parentCategoryId={parentCategory.id}
                    columns={columns}
                  />
                )}
              </Fragment>
            );
          })}

          {/* Main create row for top-level categories at the end */}
          <TableCategoriesCreateRow
            transactionTypeId={transactionTypeId}
            columns={columns}
          />
        </TableBody>
      </Table>
    </div>
  );
}
