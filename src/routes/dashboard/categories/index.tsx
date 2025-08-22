import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { deleteCategories, getCategories } from "../../../actions/categories";
import TableCategories from "../../../components/categories/TableCategories";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { type RowSelectionState } from "@tanstack/react-table";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Label } from "../../../components/ui/label";
import { CategoryType } from "../../../types/enums/TransactionTypes";
import { getEnumValues } from "../../../utils/arrays";

export const Route = createFileRoute("/dashboard/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [categoriesType, setCategoriesType] = useState(CategoryType.INCOME);
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data, status } = useQuery({
    queryKey: ["categories", categoriesType],
    queryFn: () => getCategories(categoriesType),
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
      <RadioGroup
        className="flex my-6"
        value={categoriesType.toString()}
        onValueChange={(e) =>
          setCategoriesType(
            CategoryType[
              Object.keys(CategoryType).find(
                (key) => CategoryType[key as keyof typeof CategoryType] === parseInt(e)
              ) as keyof typeof CategoryType
            ]
          )
        }
      >
        {getEnumValues(CategoryType).map((key) => (
          <div className="relative flex items-center gap-2" key={key}>
            <RadioGroupItem value={CategoryType[key as keyof typeof CategoryType].toString()} id={key} />
            <Label className="p-4" htmlFor={key}>
              {key}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {status === "pending" && <p>Loading...</p>}
      {status === "error" && <p>Error loading categories</p>}
      {status === "success" && data ? (
        <TableCategories
          transactionTypeId={categoriesType}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          data={data}
        />
      ) : (
        <span>No categories found</span>
      )}
    </>
  );
}
