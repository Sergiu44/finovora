import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ChartTooltip } from "../../../components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "../../../components/ui/button";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useMemo, useState } from "react";
import BaseWrapper from "../../../components/reusable/layouts/BaseWrapper";
import { useQuery } from "@tanstack/react-query";
import { getBudgetOverview } from "../../../utils/actions/categories";

export const Route = createFileRoute("/dashboard/budget-planner/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: budgetData, isLoading } = useQuery({
    queryKey: ["budget-overview"],
    queryFn: getBudgetOverview,
  });

  const CustomBar = (props: any) => {
    const { fill, x, y, width, height, payload, opacity, dataKey } = props;

    // Determine border radius based on spending scenario
    let radius = [0, 0, 0, 0];

    if (dataKey === "remaining") {
      // Remaining budget - rounded bottom corners
      radius = payload.spent > 0 ? [0, 0, 0, 0] : [12, 12, 0, 0];
    } else if (dataKey === "spent") {
      // Spent amount - no rounding if there's overspent, rounded top if no overspent
      radius =
        payload.overspent > 0 || payload.spent === 0
          ? [0, 0, 0, 0]
          : [12, 12, 0, 0];
    } else if (dataKey === "overspent") {
      // Overspent amount - rounded top corners
      radius = payload.overspent > 0 ? [12, 12, 0, 0] : [0, 0, 0, 0];
    }

    const [topLeft, topRight, bottomRight, bottomLeft] = radius;

    return (
      <path
        d={`
          M ${x + topLeft},${y}
          H ${x + width - topRight}
          Q ${x + width},${y} ${x + width},${y + topRight}
          V ${y + height - bottomRight}
          Q ${x + width},${y + height} ${x + width - bottomRight},${y + height}
          H ${x + bottomLeft}
          Q ${x},${y + height} ${x},${y + height - bottomLeft}
          V ${y + topLeft}
          Q ${x},${y} ${x + topLeft},${y}
          Z
        `}
        fill={fill}
        opacity={opacity}
      />
    );
  };

  const calculateBarchartWidth = (numberOfItem = 9) => {
    if (numberOfItem > 9) return numberOfItem * 100;
    return "100%";
  };

  const formattedData = useMemo(() => {
    if (!budgetData) return [];

    return budgetData.map((item) => {
      const spentAmount = Math.abs(item.actualSpending);
      const budgetAmount = item.budgetAmount;
      const remaining = Math.max(0, budgetAmount - spentAmount);
      const overspent = Math.max(0, spentAmount - budgetAmount);

      return {
        name: item.categoryName,
        spent: Math.min(spentAmount, budgetAmount), // Only show spent up to budget limit
        budget: budgetAmount,
        remaining: remaining,
        overspent: overspent,
        percentage: item.percentage,
        color:
          item.percentage > 100
            ? "#ef4444"
            : item.percentage > 80
              ? "#f59e0b"
              : "#22c55e",
      };
    });
  }, [budgetData]);

  if (isLoading) {
    return (
      <BaseWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading budget data...</div>
        </div>
      </BaseWrapper>
    );
  }

  if (!budgetData || budgetData.length === 0) {
    return (
      <BaseWrapper>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Budget planner</h1>
              <p className="text-sm text-muted-foreground">
                Manage and track your spending limits
              </p>
            </div>
            <Button
              className="flex items-center gap-2"
              type="button"
              variant="outline"
              onClick={() =>
                router.navigate({ to: "/dashboard/budget-planner/create" })
              }
            >
              Create Budget
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">No budget created yet</h3>
                <p className="text-muted-foreground">
                  Create your first budget to start tracking your spending
                </p>
                <Button
                  onClick={() =>
                    router.navigate({ to: "/dashboard/budget-planner/create" })
                  }
                  className="rounded-[16px]! flex items-center gap-1 mx-auto mt-4 px-5!"
                  size="sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Budget
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseWrapper>
    );
  }

  return (
    <BaseWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Budget planner</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your spending limits
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            type="button"
            variant="outline"
            onClick={() =>
              router.navigate({ to: "/dashboard/budget-planner/create" })
            }
          >
            Create Budget
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid gap-4">
          {/* Budget Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>
                Your spending progress across all categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <ResponsiveContainer height={500} className="overflow-x-scroll">
                  <BarChart barGap={0} barCategoryGap={0} data={formattedData}>
                    <XAxis
                      type="category"
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      textAnchor="middle"
                    />
                    <YAxis type="number" tickLine={false} axisLine={false} />
                    <Bar
                      dataKey="remaining"
                      fill="#10b981"
                      stackId="a"
                      barSize={80}
                      opacity={0.4}
                      shape={(props) => <CustomBar {...props} />}
                    />
                    <Bar
                      dataKey="spent"
                      fill="#3b82f6"
                      stackId="a"
                      barSize={80}
                      shape={(props) => <CustomBar {...props} />}
                    />
                    <Bar
                      dataKey="overspent"
                      fill="#ef4444"
                      stackId="a"
                      barSize={80}
                      shape={(props) => <CustomBar {...props} />}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (!active || !payload) return null;
                        const remaining: number =
                          Number(payload[0]?.value) || 0;
                        const spent: number = Number(payload[1]?.value) || 0;
                        const overspent: number =
                          Number(payload[2]?.value) || 0;
                        const totalBudget =
                          remaining === 0 ? spent : spent + remaining; // Total budget is spent + overspent
                        const totalSpent = spent + overspent;
                        const percentage = Math.round(
                          (totalSpent / totalBudget) * 100
                        );

                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-sm">
                            <div className="grid gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold">
                                  {payload[0]?.payload.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {percentage}% used
                                </span>
                              </div>
                              <div className="grid gap-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className="font-medium"
                                    style={{ color: "#3b82f6" }}
                                  >
                                    Spent:
                                  </span>
                                  <span
                                    className="font-medium"
                                    style={{ color: "#3b82f6" }}
                                  >
                                    ${spent.toFixed(2)}
                                  </span>
                                </div>
                                {overspent > 0 && (
                                  <div className="flex items-center justify-between gap-2">
                                    <span
                                      className="font-medium"
                                      style={{ color: "#ef4444" }}
                                    >
                                      Overspent:
                                    </span>
                                    <span
                                      className="font-medium"
                                      style={{ color: "#ef4444" }}
                                    >
                                      ${overspent.toFixed(2)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className="font-medium"
                                    style={{ color: "#10b981" }}
                                  >
                                    Remaining:
                                  </span>
                                  <span
                                    className="font-medium"
                                    style={{ color: "#10b981" }}
                                  >
                                    ${remaining.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-2 pt-1 border-t">
                                  <span className="text-muted-foreground">
                                    Total Budget:
                                  </span>
                                  <span className="font-medium">
                                    ${totalBudget.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>
                Configure spending limits for each category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {formattedData.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${(category.spent + category.overspent).toFixed(2)} of
                          ${category.budget.toFixed(2)}
                          {category.overspent > 0 && (
                            <span className="text-error-600 ml-1">
                              (+${category.overspent.toFixed(2)} over)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{category.percentage}%</p>
                        <p className="text-sm text-muted-foreground">
                          of budget used
                        </p>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          category.overspent > 0
                            ? "text-error-600"
                            : category.remaining <= 0
                              ? "text-error-600"
                              : "text-green-600"
                        }`}
                      >
                        {category.overspent > 0 ? (
                          <>${category.overspent.toFixed(2)} over budget</>
                        ) : (
                          <>${category.remaining.toFixed(2)} left</>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseWrapper>
  );
}
