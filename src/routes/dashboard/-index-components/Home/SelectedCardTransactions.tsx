import { useMemo, useState } from "react";
import { Card, CardContent, CardTitle } from "../../../../components/ui/card";
import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsForAccountAsync } from "../../../../utils/actions/transactions";
import { useUserMainAccount } from "../../../../context/UserMainAccount";
import AccordionTransactionGroupedByDate, {
  type TransactionsGrouped,
} from "./AccordionTransactionGroupedByDate";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";

export default function SelectedCardTransactions() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { account } = useUserMainAccount();
  const currentMonthRange = useMemo(() => {
    return {
      from: startOfMonth(currentMonth),
      to: endOfMonth(currentMonth),
    };
  }, [currentMonth]);

  const rangeLabel = useMemo(() => {
    if (!currentMonthRange.from || !currentMonthRange.to) {
      return "";
    }
    return `${format(currentMonthRange.from, "MMM dd")} – ${format(
      currentMonthRange.to,
      "MMM dd"
    )}`;
  }, [currentMonthRange.from, currentMonthRange.to]);

  const { data: transactionsGroupedByDate, isLoading } =
    useQuery<TransactionsGrouped>({
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
        monthValue={currentMonth}
        periodLabel={rangeLabel}
        onChangeMonth={(val: Date) => setCurrentMonth(val)}
      />
      <Card>
        <CardContent>
          <CardTitle className="text-muted-foreground flex justify-between items-center">
            <h2 className="text-lg font-bold">Transactions</h2>

            <p className="text-sm font-semibold">
              Viewing selected period ·{" "}
              <span className="text-primary">{rangeLabel}</span>
            </p>
          </CardTitle>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mb-2"></div>
              <div className="text-muted-foreground">
                Loading transactions...
              </div>
            </div>
          ) : transactionsGroupedByDate &&
            Object.keys(transactionsGroupedByDate).length > 0 ? (
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
  monthValue: Date;
  periodLabel: string;
  onChangeMonth: (val: Date) => void;
}

function TransactionPeriodSummary({
  monthValue,
  periodLabel,
  onChangeMonth,
}: SummaryProps) {
  return (
    <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-1 w-[200px]">
        <ChevronLeft onClick={() => onChangeMonth(subMonths(monthValue, 1))} />
        <p className="text-lg font-semibold text-foreground">
          {moment(monthValue).format("MMMM YYYY")}
        </p>
        <ChevronRight onClick={() => onChangeMonth(addMonths(monthValue, 1))} />
      </div>
      <div className="text-sm text-muted-foreground sm:text-right">
        <span className="text-[11px] uppercase tracking-wide">Date range</span>
        <p className="text-base font-semibold text-foreground">{periodLabel}</p>
      </div>
    </div>
  );
}
