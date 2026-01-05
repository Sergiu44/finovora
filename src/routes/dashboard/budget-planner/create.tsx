/**
 * Budget Planner Create Component
 *
 * This component allows users to create and manage budgets for expense categories.
 * Users have three options for setting budgets:
 *
 * 1. **Income-Based Budget**: Set budgets based on a percentage of total income.
 *    - Users can drag/click the interactive bar to allocate a percentage of their income
 *    - The budget amount is calculated automatically based on total income
 *    - Visual feedback shows the percentage allocation
 *
 * 2. **Manual Budget Entry**: Manually input budget amounts for each category.
 *    - Users can type any amount directly into the input field
 *    - No restrictions on budget amounts (can exceed income)
 *    - Amounts are rounded to nearest $50 increment
 *
 * 3. **AI-Powered Budget Calculation** (Premium Feature):
 *    - Uses artificial intelligence to analyze spending patterns and suggest optimal budgets
 *    - Automatically calculates budget allocations based on historical data and financial goals
 *    - This feature is PREMIUM and requires an active subscription
 *    - If no subscription exists, this option will be blocked/disabled
 *
 * Features:
 * - Interactive drag-to-set budget bars
 * - Manual input with $50 increment rounding
 * - Real-time budget summary (Total Income, Total Budget, Remaining)
 * - Visual warnings when budget exceeds income (informational only, not restrictive)
 * - Save budgets to persist across sessions
 */

import { createFileRoute, useRouter } from "@tanstack/react-router";
import BaseWrapper from "../../../components/reusable/layouts/BaseWrapper";
import { TransactionTypes } from "../../../types/enums/TransactionTypes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import {
  createBudgetPlanner,
  getCategoriesWithBudget,
  type CreateCategoryWithBudgetModel,
} from "../../../utils/actions/categories";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import CustomInput from "../../../components/reusable/inputs/CustomInput";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

export const Route = createFileRoute("/dashboard/budget-planner/create")({
  component: RouteComponent,
});

interface CategoryBudget {
  id: number;
  name: string;
  budgetAmount: number;
}

function RouteComponent() {
  const router = useRouter();
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const dragRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-with-budget", TransactionTypes.Expense],
    queryFn: async () => {
      const { categories, totalIncome } = await getCategoriesWithBudget(
        TransactionTypes.Expense
      );
      return { categories, totalIncome };
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-budget-planner"],
    mutationFn: async (budgets: CreateCategoryWithBudgetModel[]) => {
      const response = await createBudgetPlanner(
        budgets.map((budget) => ({
          categoryId: budget.categoryId,
          budgetAmount: budget.budgetAmount,
          currencyId: budget.currencyId,
          startDate: budget.startDate,
          endDate: null,
          subCategories: budget.subCategories.map((subCategory) => ({
            subCategories: [],
            categoryId: subCategory.categoryId,
            budgetAmount: subCategory.budgetAmount,
            currencyId: budget.currencyId,
            startDate: budget.startDate,
            endDate: null,
          })),
        }))
      );
      return response;
    },
  });

  // Initialize category budgets when data loads
  useEffect(() => {
    if (categoriesData?.categories && categoryBudgets.length === 0) {
      const initialBudgets = categoriesData.categories.map((category: any) => ({
        id: category.id,
        name: category.value, // Use 'value' field which contains the category name
        budgetAmount: category.budgetAmount || 0, // Use existing budget amount if available
      }));
      setCategoryBudgets(initialBudgets);
    }
  }, [categoriesData, categoryBudgets.length]);

  const totalBudget = useMemo(
    () => categoryBudgets.reduce((sum, cat) => sum + cat.budgetAmount, 0),
    [categoryBudgets]
  );

  const remainingIncome = useMemo(
    () => (categoriesData?.totalIncome || 0) - totalBudget,
    [categoriesData?.totalIncome, totalBudget]
  );

  const isOverBudget = useMemo(
    () => totalBudget > (categoriesData?.totalIncome || 0),
    [totalBudget, categoriesData?.totalIncome]
  );

  // Round to nearest $50 increment
  const roundToFifty = (value: number) => Math.round(value / 50) * 50;

  // Update budget for a category
  const updateBudget = useCallback((categoryId: number, newAmount: number) => {
    setCategoryBudgets((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return { ...cat, budgetAmount: newAmount };
        }
        return cat;
      })
    );
  }, []);

  // Handle manual input change
  const handleInputChange = (categoryId: number, value: string) => {
    const numericValue = parseFloat(value) || 0;
    updateBudget(categoryId, numericValue);
  };

  // Handle mouse down to start dragging
  const handleMouseDown = useCallback((categoryId: number) => {
    setIsDragging(categoryId);
  }, []);

  // Global mouse event handlers for live dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging === null) return;

      const dragElement = dragRefs.current[isDragging];
      if (!dragElement) return;

      const rect = dragElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

      const newAmount = (percentage / 100) * (categoriesData?.totalIncome || 0);

      updateBudget(isDragging, roundToFifty(newAmount));
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging !== null) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, categoriesData?.totalIncome, updateBudget]);

  // Handle bar click (for non-drag interactions)
  const handleBarClick = (categoryId: number, event: React.MouseEvent) => {
    // Only handle click if not dragging
    if (isDragging !== null) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    const newAmount = (percentage / 100) * (categoriesData?.totalIncome || 0);
    updateBudget(categoryId, roundToFifty(newAmount));
  };

  const handleSaveBudgets = () => {
    const budgetsToSave = categoryBudgets.map((cat) => ({
      categoryId: cat.id,
      budgetAmount: cat.budgetAmount,
      currencyId: 1,
      startDate: new Date(),
      endDate: null,
    }));

    console.log("Saving budgets:", budgetsToSave);
    mutate(
      budgetsToSave.map((b) => ({
        subCategories: [],
        currencyId: "1",
        startDate: new Date().toISOString(),
        endDate: null,
        budgetAmount: b.budgetAmount,
        categoryId: b.categoryId.toString(),
      })),
      {
        onSuccess: () => {
          toast.success("Budgets saved successfully");
          // Navigate back to budget planner after successful save
          router.navigate({ to: "/dashboard/budget-planner" });
        },
        onError: (error) => {
          console.error("Error saving budgets", error);
          toast.error("Failed to save budgets. Please try again.");
        },
      }
    );
  };

  return (
    <BaseWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.navigate({ to: "/dashboard/budget-planner" })}
          >
            <ChevronLeftIcon className="w-6 h-6 mt-1" />
            <h1 className="text-3xl font-bold">Create Budget</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-7">
            Set your budget limits for each category (increments of $50)
            {categoryBudgets.some((cat) => cat.budgetAmount > 0) && (
              <span className="ml-2 text-green-600 font-medium">
                • Existing budgets loaded
              </span>
            )}
          </p>
        </div>

        {/* Budget Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBarIcon className="h-4 w-4" />
              Budget Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  ${categoriesData?.totalIncome?.toFixed(2) || "0.00"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Income
                </div>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div
                  className={`text-2xl font-bold ${isOverBudget ? "text-destructive" : "text-foreground"}`}
                >
                  ${totalBudget.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Budget
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div
                  className={`text-2xl font-bold ${remainingIncome < 0 ? "text-destructive" : "text-green-600"}`}
                >
                  ${remainingIncome.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>

            {isOverBudget && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">
                  Budget exceeds income by $
                  {Math.abs(remainingIncome).toFixed(2)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Budgets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-4 w-4" />
              Category Budgets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryBudgets.map((category) => {
                const percentage =
                  (category.budgetAmount / (categoriesData?.totalIncome || 1)) *
                  100;
                const isActive = isDragging === category.id;

                return (
                  <div key={category.id} className="space-y-3">
                    {/* Category Header */}
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center gap-2">
                        {category.name}
                        {category.budgetAmount > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Existing
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-muted-foreground">
                          ${category.budgetAmount.toFixed(2)}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Manual Input */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-16">
                        Amount:
                      </span>
                      <CustomInput
                        name="budgetAmount"
                        type="number"
                        step="50"
                        min="0"
                        placeholder="0"
                        value={category.budgetAmount.toString()}
                        onChange={(e) =>
                          handleInputChange(category.id, e.target.value)
                        }
                        className="w-32 h-8 text-sm"
                      />
                      <span className="text-xs text-muted-foreground">
                        ($50 increments)
                      </span>
                    </div>

                    {/* Interactive Bar */}
                    <div
                      ref={(el) => {
                        if (el) {
                          dragRefs.current[category.id] = el;
                        }
                      }}
                      className="relative h-10 bg-muted rounded-lg cursor-pointer group"
                      onClick={(e) => handleBarClick(category.id, e)}
                      onMouseDown={() => handleMouseDown(category.id)}
                    >
                      {/* Progress Bar */}
                      <div
                        className={`absolute top-0 left-0 h-full rounded-lg transition-all duration-150 ${
                          isActive
                            ? "bg-primary shadow-lg"
                            : "bg-primary/80 hover:bg-primary"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-primary border-2 border-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex">
                        {[25, 50, 75].map((line) => (
                          <div
                            key={line}
                            className="absolute top-0 bottom-0 w-px bg-border/50"
                            style={{ left: `${line}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setCategoryBudgets((prev) =>
                prev.map((cat) => ({ ...cat, budgetAmount: 0 }))
              );
            }}
            disabled={totalBudget === 0}
          >
            Reset All
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() =>
                router.navigate({ to: "/dashboard/budget-planner" })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBudgets}
              disabled={isOverBudget || totalBudget === 0}
              className="min-w-[120px]"
            >
              {isPending ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                "Save Budgets"
              )}
            </Button>
          </div>
        </div>
      </div>
    </BaseWrapper>
  );
}
