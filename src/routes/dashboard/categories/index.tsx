import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  deleteCategories,
  getCategories,
} from "../../../utils/actions/categories";
import TableCategories from "./-components/TableCategories";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { type RowSelectionState } from "@tanstack/react-table";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import {
  CategoryType,
  TransactionType,
} from "../../../types/enums/TransactionTypes";
import { getEnumValues } from "../../../utils/arrays";
import BaseWrapper from "../../../components/reusable/layouts/BaseWrapper";

export const Route = createFileRoute("/dashboard/categories/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [categoriesType, setCategoriesType] = useState(TransactionType.Income);
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data, status } = useQuery({
    queryKey: ["categories", categoriesType],
    queryFn: () => getCategories(categoriesType),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationKey: ["deleteCategories"],
    mutationFn: deleteCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return (
    <>
      <BaseWrapper>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Categories</h1>
        </div>
        <Tabs
          className="my-6"
          value={categoriesType.toString()}
          onValueChange={(val) =>
            setCategoriesType(
              TransactionType[
                Object.keys(TransactionType).find(
                  (key) =>
                    TransactionType[key as keyof typeof TransactionType] ===
                    parseInt(val)
                ) as keyof typeof TransactionType
              ]
            )
          }
        >
          <TabsList
            variant={"underline"}
            className="grid grid-cols-2 w-full sm:max-w-[360px]"
          >
            {getEnumValues(TransactionType).map((key) => (
              <TabsTrigger
                variant={"underline"}
                key={"categories-" + key}
                value={CategoryType[
                  key as keyof typeof CategoryType
                ].toString()}
                className="text-sm sm:text-base"
              >
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
      </BaseWrapper>
      <div className="bg-white sticky bottom-0 py-6 px-12 inset-x-0 border-t border-sidebar-border inset-shadow-2xs">
        <Button
          variant="destructive"
          onClick={() => {
            deleteMutate(
              Object.keys(rowSelection).filter((key) => rowSelection[key])
            );
          }}
          disabled={Object.keys(rowSelection).length === 0}
        >
          Delete
        </Button>
      </div>
    </>
  );
}
