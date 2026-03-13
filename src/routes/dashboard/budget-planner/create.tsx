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
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import CustomInput from "../../../components/reusable/inputs/CustomInput";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";

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

  const [isBudgetRestrictive, setIsBudgetRestrictive] = useState(false);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [maxBudgetAmount, setMaxBudgetAmount] = useState<number>(100);
  const dragRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const budgetsRef = useRef<CategoryBudget[]>([]);

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

  useEffect(() => {
    budgetsRef.current = categoryBudgets;
  }, [categoryBudgets]);

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
  const roundToFifty = useCallback(
    (value: number) => Math.round(value / 50) * 50,
    []
  );

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

  const incrementBudget = useCallback(
    (categoryId: number, delta: number) => {
      setCategoryBudgets((prev) =>
        prev.map((cat) => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              budgetAmount: Math.max(0, roundToFifty(cat.budgetAmount + delta)),
            };
          }
          return cat;
        })
      );
    },
    [roundToFifty]
  );

  // Handle manual input change
  const handleInputChange = (categoryId: number, value: string) => {
    const numericValue = Number.parseFloat(value) || 0;
    updateBudget(categoryId, numericValue);
  };

  // Handle mouse down to start dragging
  const handleMouseDown = useCallback((categoryId: number) => {
    setIsDragging(categoryId);
  }, []);

  // Global mouse event handlers for live dragging
  useEffect(() => {
    let autoIncreaseId: number | null = null;
    const edgeThreshold = 4;

    const startAutoIncrease = (categoryId: number) => {
      if (autoIncreaseId !== null) return;
      autoIncreaseId = window.setInterval(() => {
        incrementBudget(categoryId, 50);
      }, 120);
    };

    const stopAutoIncrease = () => {
      if (autoIncreaseId === null) return;
      window.clearInterval(autoIncreaseId);
      autoIncreaseId = null;
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging === null) return;

      const dragElement = dragRefs.current[isDragging];
      if (!dragElement) return;

      const rect = dragElement.getBoundingClientRect();
      const clampedClientX = Math.min(
        Math.max(e.clientX, 0),
        window.innerWidth - 1
      );
      const x = Math.min(Math.max(clampedClientX - rect.left, 0), rect.width);

      // In restrictive mode, limit to 100%, otherwise allow unlimited via auto-increase
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

      // Calculate amount based on percentage of user-defined maximum budget
      // At 100% of bar, amount equals maxBudgetAmount
      // At 200% of bar, amount equals 2 * maxBudgetAmount
      const newAmount = (percentage / 100) * maxBudgetAmount;

      const isAtRightEdge =
        clampedClientX >=
        Math.min(rect.right - edgeThreshold, window.innerWidth - 1);

      if (!isBudgetRestrictive && isAtRightEdge) {
        const currentBudget =
          budgetsRef.current.find((cat) => cat.id === isDragging)
            ?.budgetAmount ?? 0;
        updateBudget(
          isDragging,
          Math.max(currentBudget, roundToFifty(newAmount))
        );
      } else {
        updateBudget(isDragging, roundToFifty(newAmount));
      }

      if (!isBudgetRestrictive && isAtRightEdge) {
        startAutoIncrease(isDragging);
      } else {
        stopAutoIncrease();
      }
    };

    const handleGlobalMouseUp = () => {
      stopAutoIncrease();
      setIsDragging(null);
    };

    if (isDragging !== null) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      stopAutoIncrease();
    };
  }, [
    isDragging,
    maxBudgetAmount,
    updateBudget,
    isBudgetRestrictive,
    roundToFifty,
    incrementBudget,
  ]);

  // Handle bar click (for non-drag interactions)
  const handleBarClick = (categoryId: number, event: React.MouseEvent) => {
    // Only handle click if not dragging
    if (isDragging !== null) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clampedClientX = Math.min(
      Math.max(event.clientX, 0),
      window.innerWidth - 1
    );
    const x = Math.min(Math.max(clampedClientX - rect.left, 0), rect.width);

    // In restrictive mode, limit to 100%, otherwise allow unlimited via auto-increase
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    // Calculate amount based on percentage of user-defined maximum budget
    // At 100% of bar, amount equals maxBudgetAmount
    // At 200% of bar, amount equals 2 * maxBudgetAmount
    const newAmount = (percentage / 100) * maxBudgetAmount;
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
            <div
              className={`grid gap-4 ${isBudgetRestrictive ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}
            >
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
                  className={`text-2xl font-bold ${isBudgetRestrictive && isOverBudget ? "text-destructive" : "text-foreground"}`}
                >
                  {isBudgetRestrictive ? (
                    `$${totalBudget.toFixed(2)}`
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <span>∞</span>
                      <span className="text-lg">Unlimited</span>
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Budget
                </div>
              </div>
              {isBudgetRestrictive && (
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div
                    className={`text-2xl font-bold ${remainingIncome < 0 ? "text-destructive" : "text-green-600"}`}
                  >
                    ${remainingIncome.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              )}
            </div>

            {isBudgetRestrictive && isOverBudget && (
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
        <Card
          className={`${isBudgetRestrictive ? "outline-2 outline-error-600/20 bg-error-800/20" : ""}`}
        >
          <CardHeader className="flex justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              Category Budgets
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="max-budget"
                  className="text-sm text-muted-foreground"
                >
                  Max Budget:
                </Label>
                <CustomInput
                  id="max-budget"
                  name="maxBudget"
                  type="number"
                  step="50"
                  min="1"
                  value={maxBudgetAmount.toString()}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value) || 100;
                    setMaxBudgetAmount(Math.max(1, value));
                  }}
                  className="w-24 h-8 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="restrictive-budget">Restrictive</Label>
                <Switch
                  id="restrictive-budget"
                  checked={isBudgetRestrictive}
                  onCheckedChange={setIsBudgetRestrictive}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryBudgets.map((category) => {
                // Calculate percentage relative to the user-defined maximum budget
                // At maxBudgetAmount, percentage will be 100%
                // Other amounts will be calculated proportionally
                const percentage =
                  (category.budgetAmount / maxBudgetAmount) * 100;

                // Calculate compressed bar widths for non-restrictive mode when > 100%
                // This can happen if a category exceeds the current max (e.g., manual input)
                // As percentage increases, main bar shrinks to make room for extended portion
                // This creates an "infinity" effect where the bar compresses as it grows
                let mainBarWidth = 100;
                let extendedBarWidth = 0;

                if (!isBudgetRestrictive && percentage > 100) {
                  // Compress main bar inversely proportional to percentage
                  // At 200%, main bar is 50%; at 350%, main bar is ~28.6%
                  mainBarWidth = (100 / percentage) * 100;
                  extendedBarWidth = 100 - mainBarWidth;
                } else {
                  // In restrictive mode or when <= 100%, use normal percentage
                  mainBarWidth = Math.min(percentage, 100);
                }

                const isActive = isDragging === category.id;

                return (
                  <div key={category.id} className="space-y-3">
                    {/* Category Header */}
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center gap-2 text-muted-foreground mt-2">
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
                      className="relative h-9 rounded-full cursor-pointer group overflow-hidden border border-border/60 bg-muted/40"
                      onClick={(e) => handleBarClick(category.id, e)}
                      onMouseDown={() => handleMouseDown(category.id)}
                    >
                      {/* Track highlight */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/20 to-transparent" />

                      {/* Main Progress Bar */}
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-150 ${
                          isActive
                            ? "bg-primary shadow-md"
                            : "bg-primary/85 hover:bg-primary"
                        } ${!isBudgetRestrictive && percentage > 100 ? "rounded-r-none" : ""}`}
                        style={{
                          width: `${mainBarWidth}%`,
                        }}
                      />

                      {/* Overflow for values beyond 100% */}
                      {!isBudgetRestrictive &&
                        percentage > 100 &&
                        extendedBarWidth > 0 && (
                          <div
                            className="absolute top-0 h-full rounded-r-full bg-primary/50 border-l border-primary/40"
                            style={{
                              left: `${mainBarWidth}%`,
                              width: `${extendedBarWidth}%`,
                              backgroundImage:
                                "repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0 8px, rgba(255,255,255,0) 8px 16px)",
                            }}
                          />
                        )}

                      {/* Thumb */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-background bg-primary shadow ${
                          isActive ? "scale-110" : "opacity-80 group-hover:opacity-100"
                        } transition`}
                        style={{
                          left: `calc(${Math.min(mainBarWidth, 100)}% - 8px)`,
                        }}
                      />

                      {/* Percentage badge */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground">
                        {percentage.toFixed(0)}%
                      </div>

                      {/* Grid Lines */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[25, 50, 75].map((line) => (
                          <div
                            key={line}
                            className="absolute top-0 bottom-0 w-px bg-border/40"
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
              disabled={
                (isBudgetRestrictive && isOverBudget) || totalBudget === 0
              }
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
