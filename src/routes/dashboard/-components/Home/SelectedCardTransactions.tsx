import { useMemo, useState } from "react";
import { Card, CardContent, CardTitle } from "../../../../components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { endOfMonth, format, isSameMonth, startOfMonth } from "date-fns";
import { Button } from "../../../../components/ui/button";
import {
  CalendarIcon,
} from "lucide-react";
import { Calendar } from "../../../../components/ui/calendar";
import type { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsForAccountAsync } from "../../../../utils/actions/transactions";
import { useUserMainAccount } from "../../../../context/UserMainAccount";
import AccordionTransactionGroupedByDate, {
  type TransactionsGrouped,
} from "./AccordionTransactionGroupedByDate";

export default function SelectedCardTransactions() {
  const { account } = useUserMainAccount();
  const currentMonthRange = useMemo<DateRange>(() => {
    const now = new Date();
    return {
      from: startOfMonth(now),
      to: endOfMonth(now),
    };
  }, []);
  const [date, setDate] = useState<DateRange | undefined>(currentMonthRange);

  const isCurrentMonthFilter =
    !!date?.from &&
    !!date?.to &&
    !!currentMonthRange.from &&
    !!currentMonthRange.to &&
    isSameMonth(date.from, currentMonthRange.from) &&
    isSameMonth(date.to, currentMonthRange.to);

  const {
    data: transactionsGroupedByDate,
    isLoading,
  } = useQuery<TransactionsGrouped>({
    queryKey: ["transactions", account?.id, date?.from, date?.to],
    queryFn: () => {
      const startDate = date?.from
        ? format(date.from, "yyyy-MM-dd")
        : undefined;
      const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : undefined;
      return getTransactionsForAccountAsync(account!.id, startDate, endDate);
    },
  });

  const clearFilters = () => {
    setDate(currentMonthRange);
  };

  const rangeLabel = useMemo(() => {
    if (date?.from && date?.to) {
      return `${format(date.from, "MMM dd")} – ${format(date.to, "MMM dd")}`;
    }
    if (currentMonthRange.from && currentMonthRange.to) {
      return `${format(currentMonthRange.from, "MMM dd")} – ${format(
        currentMonthRange.to,
        "MMM dd"
      )}`;
    }
    return "";
  }, [date, currentMonthRange]);

  return (
    <div className="space-y-2">
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full bg-primary/70 text-primary-foreground shadow-sm border border-primary/70">
        <span className="inline-block size-2 rounded-full bg-primary-foreground/80"></span>
        <span>{isCurrentMonthFilter ? "Current Month" : "Custom Range"}</span>
        <span className="text-primary-foreground/80">{rangeLabel}</span>
      </div>
      <Card>
        <CardContent>
        <CardTitle className="text-muted-foreground flex justify-between items-center">
          <h2 className="grow-1 w-full text-lg font-bold">Transactions</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!date}
                className="text-sm! data-[empty=true]:text-muted-foreground text-slate-700 justify-start text-left font-normal w-min"
              >
                <CalendarIcon />
                {date?.from && date?.to ? (
                  `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
                ) : (
                  <span>
                    {currentMonthRange.from && currentMonthRange.to
                      ? `${format(currentMonthRange.from, "dd/MM/yyyy")} - ${format(
                          currentMonthRange.to,
                          "dd/MM/yyyy"
                        )}`
                      : "Pick a date"}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                weekStartsOn={1}
                numberOfMonths={2}
                mode="range"
                selected={date}
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>
        </CardTitle>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-semibold text-primary">
            Viewing {isCurrentMonthFilter ? "the current month" : "a custom range"} · {rangeLabel}
          </p>
          {!isCurrentMonthFilter && (
            <Button
              variant="ghost"
              size="xs"
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 cursor-pointer px-2 text-xs flex items-center gap-1"
            >
              Reset to current month
            </Button>
          )}
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
              {date
                ? "No transactions found for the selected date range"
                : "Select a date range to filter transactions"}
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
