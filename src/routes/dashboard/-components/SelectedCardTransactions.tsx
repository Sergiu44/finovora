import { useMemo } from "react";
import { Card, CardContent, CardTitle } from "../../../components/ui/card";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsForAccountAsync } from "../../../utils/actions/transactions";
import { useUserMainAccount } from "../../../context/UserMainAccount";
import AccordionTransactionGroupedByDate, {
  type TransactionsGrouped,
} from "./AccordionTransactionGroupedByDate";
import { useTransactionsPreferences } from "../../../context/TransactionsPreferences";

export default function SelectedCardTransactions() {
  const { account } = useUserMainAccount();
  const { currentDateRange } = useTransactionsPreferences();
  const rangeLabel = useMemo(() => {
    if (!currentDateRange.from || !currentDateRange.to) {
      return "";
    }
    return `${format(currentDateRange.from, "MMM dd")} – ${format(
      currentDateRange.to,
      "MMM dd",
    )}`;
  }, [currentDateRange.from, currentDateRange.to]);
  const { data: transactionsGroupedByDate, isLoading } =
    useQuery<TransactionsGrouped>({
      queryKey: [
        "transactions",
        account?.id,
        currentDateRange.from,
        currentDateRange.to,
      ],
      queryFn: () => {
        const startDate = currentDateRange.from
          ? format(currentDateRange.from, "yyyy-MM-dd")
          : undefined;
        const endDate = currentDateRange.to
          ? format(currentDateRange.to, "yyyy-MM-dd")
          : undefined;
        return getTransactionsForAccountAsync(account!.id, startDate, endDate);
      },
    });

  return (
    <div className="space-y-4">
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
