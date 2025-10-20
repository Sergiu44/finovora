import { createFileRoute } from "@tanstack/react-router";
import { useUserMainAccount } from "../../context/UserMainAccount";
import { useMemo } from "react";
import { format } from "date-fns";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { CardContent } from "../../components/ui/card";

export const Route = createFileRoute("/dashboard/reports")({
  component: RouteComponent,
});

function RouteComponent() {
  const { account } = useUserMainAccount();

  const chartData = useMemo(() => {
    return account?.transactions.map((transaction) => ({
      date: format(transaction.transactionDate, "yyyy-MM-dd"),
      amount: transaction.amount,
    }));
  }, [account?.id]);

  const chartConfig = {
    amount: {
      label: "Amount",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
      <ChartContainer
        className="aspect-auto h-[250px] w-full"
        config={chartConfig}
      >
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="mobile"
            type="natural"
            fill="url(#fillMobile)"
            stroke="var(--color-mobile)"
            stackId="a"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  );
}
