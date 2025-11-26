import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardTitle } from "../../../../components/ui/card";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsForAccountAsync } from "../../../../utils/actions/transactions";
import { useUserMainAccount } from "../../../../context/UserMainAccount";
import AccordionTransactionGroupedByDate, {
  type TransactionsGrouped,
} from "./AccordionTransactionGroupedByDate";

export default function SelectedCardTransactions() {
  const { account } = useUserMainAccount();
  const [weekStartsOn, setWeekStartsOn] = useState<number>(1);
  const currentMonthRange = useMemo(() => {
    const now = new Date();
    return {
      from: startOfMonth(now),
      to: endOfMonth(now),
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedPreference = window.localStorage.getItem(
      "finovora:calendar-week-start"
    );
    if (!storedPreference) return;
    const parsed = Number(storedPreference);
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 6) {
      setWeekStartsOn(parsed);
    }
  }, []);

  const rangeLabel = useMemo(() => {
    if (!currentMonthRange.from || !currentMonthRange.to) {
      return "";
    }
    return `${format(currentMonthRange.from, "MMM dd")} – ${format(
      currentMonthRange.to,
      "MMM dd"
    )}`;
  }, [currentMonthRange.from, currentMonthRange.to]);

  const {
    data: transactionsGroupedByDate,
    isLoading,
  } = useQuery<TransactionsGrouped>({
    queryKey: [
      "transactions",
      account?.id,
      currentMonthRange.from,
      currentMonthRange.to,
    ],
    queryFn: () => {
      const startDate = currentMonthRange.from
        ? format(currentMonthRange.from, "yyyy-MM-dd")
        : undefined;
      const endDate = currentMonthRange.to
        ? format(currentMonthRange.to, "yyyy-MM-dd")
        : undefined;
      return getTransactionsForAccountAsync(account!.id, startDate, endDate);
    },
  });

  return (
    <div className="space-y-4">
      <TransactionPeriodSummary
        monthLabel={
          currentMonthRange.from
            ? format(currentMonthRange.from, "MMMM yyyy")
            : ""
        }
        periodLabel={rangeLabel}
        preferenceLabel={`Week starts on ${
          weekdayLabels[weekStartsOn] ?? "Monday"
        }`}
      />
      <Card>
        <CardContent>
        <CardTitle className="text-muted-foreground flex justify-between items-center">
          <h2 className="grow-1 w-full text-lg font-bold">Transactions</h2>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Current month overview
          </p>
        </CardTitle>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-semibold text-primary">
            Viewing the current month · {rangeLabel}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
            <div className="text-muted-foreground">Loading transactions...</div>
          </div>
        ) : transactionsGroupedByDate && Object.keys(transactionsGroupedByDate).length > 0 ? (
          <AccordionTransactionGroupedByDate
            groupedTransactions={transactionsGroupedByDate}
            currencyCode={account?.currency.code}
          />
        ) : (
          <div className="text-muted-foreground text-center py-8">
            <div className="text-gray-400 mb-2">📊</div>
            <div>No transactions found</div>
            <div className="text-sm mt-1">
              No transactions found for the current month
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}

interface SummaryProps {
  monthLabel: string;
  preferenceLabel: string;
  periodLabel: string;
}

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function TransactionPeriodSummary({
  monthLabel,
  preferenceLabel,
  periodLabel,
}: SummaryProps) {
  return (
    <div className="rounded-2xl border border-border bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        Current Month
      </p>
      <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-foreground">{monthLabel}</p>
          <p className="text-sm text-muted-foreground">{preferenceLabel}</p>
        </div>
        <div className="text-sm text-muted-foreground sm:text-right">
          <span className="text-[11px] uppercase tracking-wide">
            Active period
          </span>
          <p className="text-base font-semibold text-foreground">{periodLabel}</p>
        </div>
      </div>
    </div>
  );
}
