import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { deleteCategories, getCategories } from "../../../actions/categories";
import TableCategories from "../../../components/categories/TableCategories";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { type RowSelectionState } from "@tanstack/react-table";

export const Route = createFileRoute("/dashboard/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data, status } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { mutate: deleteMutate, status: deleteStatus } = useMutation({
    mutationKey: ["deleteCategories"],
    mutationFn: deleteCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button
          variant="destructive"
          onClick={() => {
            deleteMutate(Object.keys(rowSelection).filter((key) => rowSelection[key]));
          }}
          disabled={Object.keys(rowSelection).length === 0}
        >
          Delete
        </Button>
      </div>
      {status === "pending" && <p>Loading...</p>}
      {status === "error" && <p>Error loading categories</p>}
      {status === "success" && data ? (
        <TableCategories rowSelection={rowSelection} setRowSelection={setRowSelection} data={data} />
      ) : (
        <span>No categories found</span>
      )}
    </>
  );
}
