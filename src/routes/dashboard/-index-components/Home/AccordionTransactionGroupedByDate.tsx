import moment from "moment";
import {
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../components/ui/accordion";
import AddTransactionForCurrentAccount from "../AddTransactionForCurrentAccount";
import { useState } from "react";

export interface TransactionType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  parentCategoryId: number | null;
  transactionTypeId: number;
}

export interface Transaction {
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

export type TransactionsGrouped = Record<
  string,
  {
    totalAmount: number;
    totalIncome: number;
    totalExpenses: number;
    transactions: Transaction[];
  }
>;

interface AccordionTransactionGroupedByDateProps {
  groupedTransactions?: TransactionsGrouped;
  currencyCode?: string;
}

const AccordionTransactionGroupedByDate = ({
  groupedTransactions,
  currencyCode = "",
}: AccordionTransactionGroupedByDateProps) => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | undefined>(undefined);
  
  if (!groupedTransactions || Object.keys(groupedTransactions).length === 0) {
    return null;
  }

  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    const formattedAmount = numAmount.toLocaleString("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `${numAmount >= 0 ? "+" : ""}${formattedAmount} ${
      currencyCode ?? ""
    }`;
  };

  const formatSummaryAmount = (amount: number) => {
    const formattedAmount = amount.toLocaleString("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${amount >= 0 ? "+" : ""}${formattedAmount} ${
      currencyCode ?? ""
    }`;
  };

  const formatExpenseAmount = (amount: number) => {
    const formattedAmount = amount.toLocaleString("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `-${formattedAmount} ${currencyCode ?? ""}`;
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
    <div className="flex flex-col gap-3 mt-4">
        <Accordion type="multiple">

      {Object.entries(groupedTransactions).map(([dateKey, summary]) => {
        const formattedDate = moment(dateKey).format("DD-MMM-YYYY");

        return (
          <AccordionItem
            key={dateKey}
            value={dateKey}
          >
            <AccordionTrigger
              type="button"
              className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-primary/10"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {formattedDate}
                </p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {summary.transactions.length} transactions
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-green-600">
                  Income: {formatSummaryAmount(summary.totalIncome)}
                </span>
                <span className="text-red-600">
                  Expenses: {formatExpenseAmount(summary.totalExpenses)}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-2 mt-1">
                {summary.transactions.map((transaction) => (
                  <div
                  onClick={() => setSelectedTransactionId(transaction.id)}
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-white rounded-base border border-gray-200 hover:border-primary/30 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-50 rounded-full border border-gray-200">
                        {getTransactionIcon(transaction.transactionType.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground">
                          {transaction.description}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {transaction.category && (
                            <>
                              <span className="bg-gray-200 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                                {transaction.category.name}
                              </span>
                              <span>•</span>
                            </>
                          )}
                          <span>
                            {moment(transaction.transactionDate).format(
                              "DD/MM/YYYY"
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
                      <div className="text-[11px] text-gray-400">
                        {transaction.transactionType.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
        </Accordion>

        <AddTransactionForCurrentAccount open={!!selectedTransactionId} setOpen={() => setSelectedTransactionId(undefined)} transactionId={selectedTransactionId} />

    </div>
  );
};

export default AccordionTransactionGroupedByDate;