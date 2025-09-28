import { useState } from "react";
import { Card, CardContent, CardTitle } from "../../../../components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Button } from "../../../../components/ui/button";
import {
  CalendarIcon,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUpDown,
} from "lucide-react";
import { Calendar } from "../../../../components/ui/calendar";
import type { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsForAccountAsync } from "../../../../utils/actions/transactions";
import { useUserMainAccount } from "../../../../context/UserMainAccount";

interface TransactionType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  parentCategoryId: number | null;
  transactionTypeId: number;
}

interface Transaction {
  id: number;
  userId: number;
  accountId: number;
  transactionTypeId: number;
  categoryId: number;
  amount: string;
  description: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  transactionType: TransactionType;
  category?: Category;
}

export default function SelectedCardTransactions() {
  const { account } = useUserMainAccount();
  const [date, setDate] = useState<DateRange>();

  const { data: transactions, isLoading } = useQuery({
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
    setDate(undefined);
  };

  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    const formattedAmount = numAmount.toLocaleString("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return numAmount >= 0
      ? `+${formattedAmount} ${account?.currency.code}`
      : `${formattedAmount} ${account?.currency.code}`;
  };

  const getTransactionIcon = (transactionType: string) => {
    if (transactionType === "Transfer") {
      return <ArrowUpDown className="h-4 w-4 text-gray-500" />;
    }
    return transactionType === "Expense" ? (
      <ArrowDownLeft className="h-4 w-4 text-red-500" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    );
  };

  return (
    <Card className="mt-4">
      <CardContent>
        <CardTitle className="text-muted-foreground flex justify-between items-center">
          <h2 className="grow-1 w-full">Transactions</h2>
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
                ) : date?.from ? (
                  format(date.from, "dd/MM/yyyy")
                ) : date?.to ? (
                  format(date.to, "dd/MM/yyyy")
                ) : (
                  <span>Pick a date</span>
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

        {date && (
          <Button
            variant="link"
            onClick={clearFilters}
            className="text-slate-500 hover:text-slate-700 cursor-pointer px-0 text-sm! flex items-center gap-1"
          >
            Clear filters
          </Button>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
            <div className="text-muted-foreground">Loading transactions...</div>
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="flex flex-col gap-3 mt-4">
            {transactions.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border border-gray-300">
                    {getTransactionIcon(transaction.transactionType.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-md text-gray-900">
                      {transaction.description}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {transaction.category && (
                        <>
                          <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                            {transaction.category.name}
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span>
                        {format(
                          new Date(transaction.transactionDate),
                          "dd/MM/yyyy"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      parseFloat(transaction.amount) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatAmount(transaction.amount)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {transaction.transactionType.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
  );
}
