import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ChartContainer, ChartTooltip } from "../../../components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Button } from "../../../components/ui/button";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useMemo, useState } from "react";
import BaseWrapper from "../../../components/reusable/layouts/BaseWrapper";
import { useQuery } from "@tanstack/react-query";
import {
  getBudgetOverview,
  type BudgetOverviewData,
} from "../../../utils/actions/categories";

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
    const { fill, x, y, width, height, payload, opacity } = props;
    const remaining = payload.remaining;
    const radius =
      remaining <= 0 ? [12, 12, 12, 12] : props.radius || [0, 0, 0, 0];

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

  const formattedData = useMemo(() => {
    if (!budgetData) return [];

    return budgetData.map((item) => ({
      name: item.categoryName,
      spent: item.actualSpending,
      budget: item.budgetAmount,
      remaining: item.remaining,
      percentage: item.percentage,
      color:
        item.percentage > 100
          ? "#ef4444"
          : item.percentage > 80
            ? "#f59e0b"
            : "#22c55e",
    }));
  }, [budgetData]);

  const chartConfig = {
    consumed: {
      label: "Consumed",
      color: "var(--error-600)",
    },
    remaining: {
      label: "Remaining",
      color: "var(--green-600)",
    },
  };

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
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">
                  No budgets created yet
                </h3>
                <p className="text-muted-foreground">
                  Create your first budget to start tracking your spending
                </p>
                <Button
                  onClick={() =>
                    router.navigate({ to: "/dashboard/budget-planner/create" })
                  }
                  className="flex items-center gap-2"
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
                <ChartContainer config={chartConfig}>
                  <BarChart
                    data={formattedData}
                    margin={{ top: 0, right: 0, bottom: 0, left: 100 }}
                    barGap={0}
                  >
                    <XAxis
                      type="category"
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      tick={{ fontSize: 12 }}
                      height={50}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis type="number" tickLine={false} axisLine={false} />
                    <Bar
                      dataKey="remaining"
                      fill="black"
                      stackId="a"
                      barSize={80}
                      shape={(props) => (
                        <CustomBar {...props} radius={[0, 0, 12, 12]} />
                      )}
                    />
                    <Bar
                      dataKey="spent"
                      fill="black"
                      stackId="a"
                      barSize={80}
                      opacity={0.15}
                      shape={(props) => (
                        <CustomBar {...props} radius={[12, 12, 0, 0]} />
                      )}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (!active || !payload) return null;
                        const spent = payload[0]?.value || 0;
                        const remaining = payload[1]?.value || 0;
                        const total = spent + remaining;
                        const percentage = Math.round((spent / total) * 100);

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
                                  <span className="text-error-600 font-medium">
                                    Spent:
                                  </span>
                                  <span className="font-medium text-error-600">
                                    ${spent.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-green-600 font-medium">
                                    Remaining:
                                  </span>
                                  <span className="font-medium text-green-600">
                                    ${remaining.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-2 pt-1 border-t">
                                  <span className="text-muted-foreground">
                                    Total Budget:
                                  </span>
                                  <span className="font-medium">
                                    ${total.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </BarChart>
                </ChartContainer>
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
                          ${category.spent.toFixed(2)} of $
                          {category.budget.toFixed(2)}
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
                          category.remaining <= 0
                            ? "text-error-600"
                            : "text-green-600"
                        }`}
                      >
                        ${Math.abs(category.remaining).toFixed(2)}{" "}
                        {category.remaining <= 0 ? "over" : "left"}
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
