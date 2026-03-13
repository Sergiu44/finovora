import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  deleteCategories,
  getCategories,
  type BaseCategory,
} from "../../../utils/actions/categories";
import TableCategories from "./-components/TableCategories";
import { Button } from "../../../components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { type RowSelectionState } from "@tanstack/react-table";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import {
  CategoryType,
  TransactionType,
} from "../../../types/enums/TransactionTypes";
import { getEnumValues } from "../../../utils/arrays";
import BaseWrapper from "../../../components/reusable/layouts/BaseWrapper";
import { LoadingPlaceholder } from "../../../components/reusable/loadingPlaceholder/LoadingPlaceholder";
import { Loader2, AlertCircle } from "lucide-react";

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
      setRowSelection({});
    },
  });

  // Clear row selection when switching tabs
  useEffect(() => {
    setRowSelection({});
  }, [categoriesType]);

  // Flatten all categories (parent + subcategories) for lookup
  const flattenedCategories = useMemo(() => {
    if (!data) return [];
    const flatten = (categories: BaseCategory[]): BaseCategory[] => {
      const result: BaseCategory[] = [];
      categories.forEach((cat) => {
        result.push(cat);
        if (cat.subCategories && cat.subCategories.length > 0) {
          result.push(...flatten(cat.subCategories));
        }
      });
      return result;
    };
    return flatten(data);
  }, [data]);

  // Create a map of category IDs to categories for quick lookup
  const categoryMap = useMemo(() => {
    const map = new Map<number, BaseCategory>();
    flattenedCategories.forEach((cat) => {
      map.set(cat.id, cat);
    });
    return map;
  }, [flattenedCategories]);

  // Get selected categories and group them by type (parent vs subcategory)
  const groupedSelectedCategories = useMemo(() => {
    const selectedIds = Object.keys(rowSelection).filter(
      (id) => rowSelection[id]
    );

    const selectedCategories = selectedIds
      .map((id) => categoryMap.get(Number(id)))
      .filter((cat): cat is BaseCategory => cat !== undefined);

    // Group by parent vs subcategory
    const parentCategories: BaseCategory[] = [];
    const subCategories: BaseCategory[] = [];

    // Get all parent category IDs
    const parentIds = new Set(data?.map((cat) => cat.id) || []);

    selectedCategories.forEach((cat) => {
      if (parentIds.has(cat.id)) {
        parentCategories.push(cat);
      } else {
        subCategories.push(cat);
      }
    });

    return { parentCategories, subCategories };
  }, [rowSelection, categoryMap, data]);

  const selectedCount =
    groupedSelectedCategories.parentCategories.length +
    groupedSelectedCategories.subCategories.length;

  // Get transaction type name
  const transactionTypeName = useMemo(() => {
    const key = Object.keys(TransactionType).find(
      (k) =>
        TransactionType[k as keyof typeof TransactionType] === categoriesType
    );
    return key || "";
  }, [categoriesType]);

  return (
    <>
      <BaseWrapper>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Categories</h1>
        </div>
        <Tabs
          className="my-3"
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
          <TabsList className="grid grid-cols-2 w-full sm:max-w-[300px]">
            {getEnumValues(TransactionType).map((key) => (
              <TabsTrigger
                key={"categories-" + key}
                value={CategoryType[
                  key as keyof typeof CategoryType
                ].toString()}
                className="text-sm"
              >
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {status === "pending" && (
          <LoadingPlaceholder
            icon={Loader2}
            title="Loading categories"
            description="Please wait while we fetch your categories..."
            className="min-h-[50vh]"
          />
        )}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <AlertCircle className="h-8 w-8 text-destructive mb-4" />
            <p className="text-sm font-medium text-destructive mb-2">
              Error loading categories
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
          </div>
        )}
        {status === "success" && data ? (
          data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                No categories found
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Create your first category to get started.
              </p>
            </div>
          ) : (
            <TableCategories
              transactionTypeId={categoriesType}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              data={data}
            />
          )
        ) : null}
      </BaseWrapper>
      <div className="bg-white sticky bottom-0 py-6 px-8 inset-x-0 border-t border-sidebar-border inset-shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {selectedCount > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {selectedCount}{" "}
                  {selectedCount === 1 ? "category" : "categories"} selected (
                  {transactionTypeName})
                </p>
                <div className="space-y-2">
                  {groupedSelectedCategories.parentCategories.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Parent Categories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {groupedSelectedCategories.parentCategories.map(
                          (category) => (
                            <span
                              key={category.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                            >
                              {category.name}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {groupedSelectedCategories.subCategories.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Subcategories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {groupedSelectedCategories.subCategories.map(
                          (category) => (
                            <span
                              key={category.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                            >
                              {category.name}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No categories selected
              </p>
            )}
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              deleteMutate(
                Object.keys(rowSelection)
                  .filter((key) => rowSelection[key])
                  .map(String)
              );
            }}
            disabled={selectedCount === 0}
          >
            Delete {selectedCount > 0 && `(${selectedCount})`}
          </Button>
        </div>
      </div>
    </>
  );
}
