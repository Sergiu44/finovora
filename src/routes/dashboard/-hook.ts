import { useQuery, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useUserMainAccount } from "../../context/UserMainAccount";
import type { BaseHookProps } from "../../types/utils/BaseHookProps";
import { getUserCardAccounts, type DeleteAccount, deleteUserAccount, type AccountCardFormat } from "../../utils/actions/accounts/userAccounts";

type DashboardHookProps = {}

export function useDashboard({ queryClient }: BaseHookProps<DashboardHookProps>) {
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
  
    const { account, setUserMainAccountId } = useUserMainAccount();
  
    const { data: userAccounts } = useQuery({
      queryKey: ["userAccounts"],
      queryFn: () => getUserCardAccounts(),
    });
  
    const { mutate: deleteAccount } = useMutation({
      mutationKey: ["deleteAccount"],
      mutationFn: (account: DeleteAccount) => {
        setIsRemoving(true);
        return new Promise((resolve) => {
          setTimeout(() => {
            deleteUserAccount(account).then(resolve);
            setOpenDeleteAccountModal(false);
            setUserMainAccountId(undefined);
          }, 300); // Match animation duration
        });
      },
      onSuccess: () => {
        setIsRemoving(false);
        queryClient.invalidateQueries({ queryKey: ["userAccounts"] });
      },
    });

    return { openDeleteAccountModal, isRemoving, account, userAccounts, deleteAccount, setOpenDeleteAccountModal, setUserMainAccountId}
}

type DashboardTransformersHookProps = {
  account: AccountCardFormat | undefined;
}

export function useDashboardTransformers({ account }: DashboardTransformersHookProps) {
  const income = useMemo(() => {
    return account?.transactions
      ?.filter((transaction) => transaction.transactionType.name === "Income")
      .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
  }, [account?.transactions]);
  const expenses = useMemo(() => {
    return account?.transactions
      ?.filter((transaction) => transaction.transactionType.name === "Expense")
      .reduce((acc, transaction) => {
        const amount = parseFloat(transaction.amount);
        // Get absolute value for expenses total (always positive for display)
        return acc + Math.abs(amount);
      }, 0);
  }, [account?.transactions]);

  // This month's net (income - expenses for current month only)
  const thisMonthNet = useMemo(() => {
    return (income || 0) - (expenses || 0);
  }, [income, expenses]);

  // Format balance for display
  const formattedBalance = useMemo(() => {
    if (!account) return null;
    return parseFloat(account.balance.toString()).toFixed(2);
  }, [account]);

  const topSpendingCategory = useMemo(() => {
    if (!account?.transactions) return null;

    const expenseTransactions = account.transactions.filter(
      (transaction) => transaction.transactionType.name === "Expense",
    );

    const categoryTotals = expenseTransactions.reduce(
      (acc, transaction) => {
        if (!transaction.category) return acc;
        const categoryName = transaction.category.name;
        const amount = Math.abs(parseFloat(transaction.amount));

        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        acc[categoryName] += amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const entries = Object.entries(categoryTotals);
    if (entries.length === 0) return null;

    const [topCategory, topAmount] = entries.reduce((max, [name, amount]) =>
      amount > max[1] ? [name, amount] : max,
    );

    return { name: topCategory, amount: topAmount };
  }, [account?.transactions]);

  return { thisMonthNet, topSpendingCategory, formattedBalance, income, expenses }
}