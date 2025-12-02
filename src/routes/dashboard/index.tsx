import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  deleteUserAccount,
  getUserCardAccounts,
  type DeleteAccount,
} from "../../utils/actions/accounts/userAccounts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AccountPreviewCard from "./settings/accounts/-components/AccountPreviewCard";
import EmptyAccountCard from "./settings/accounts/-components/EmptyAccountCard";
import { isDefaultGradientItem } from "../../utils/actions/nomenclatures/defaultGradient";
import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { useUserMainAccount } from "../../context/UserMainAccount";
import ConfirmationModal from "../../components/reusable/dialogs/ConfirmationModal";
import BaseWrapper from "../../components/reusable/layouts/BaseWrapper";
import { TrashIcon } from "@heroicons/react/24/outline";
import SelectedCardTransactions from "./-index-components/Home/SelectedCardTransactions";
import { CreditCard } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [openAccountsDialog, setOpenAccountsDialog] = useState(false);
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const queryClient = useQueryClient();
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
      (transaction) => transaction.transactionType.name === "Expense"
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
      {} as Record<string, number>
    );

    const entries = Object.entries(categoryTotals);
    if (entries.length === 0) return null;

    const [topCategory, topAmount] = entries.reduce((max, [name, amount]) =>
      amount > max[1] ? [name, amount] : max
    );

    return { name: topCategory, amount: topAmount };
  }, [account?.transactions]);

  return (
    <BaseWrapper>
      <h1 className="text-3xl font-bold ml-2.5">Dashboard</h1>
      <p className="text-sm text-muted-foreground ml-2.5">
        Easy way to manage your finances
      </p>

      {account && (
        <Card className="border-border mt-4 py-2">
          <CardContent className="px-2">
            <Button
              type="button"
              variant="ghost-destructive"
              className="w-full justify-start transition-none rounded-[8px]!"
              size="xs"
              onClick={() => setOpenDeleteAccountModal(true)}
            >
              <TrashIcon className="w-4 h-4 mr-2" /> Delete account
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-[minmax(250px,350px)_1fr_1fr] grid-rows-[auto_auto_auto] gap-4 mt-4">
        <div className={`grow relative`}>
          <AnimatePresence mode="wait">
            {account ? (
              <div className="relative">
                <AccountPreviewCard
                  isRemoving={isRemoving}
                  onClick={() => setOpenAccountsDialog(!openAccountsDialog)}
                  wrapperClassName={`z-10 cursor-pointer relative transition-all duration-200 ${openAccountsDialog ? "scale-105" : ""}`}
                  name={account.name}
                  description={account.description || ""}
                  accountType={account.accountType.name}
                  currency={account.currency.code}
                  gradient={(() => {
                    return {
                      type: "default",
                      id:
                        account.defaultGradient?.id ||
                        account.userGradient?.id ||
                        0,
                      name:
                        account.defaultGradient?.name ||
                        account.userGradient?.name ||
                        "",
                      slug:
                        account.defaultGradient?.slug ||
                        account.userGradient?.slug ||
                        "",

                      colors: isDefaultGradientItem(
                        account.defaultGradient || account.userGradient
                      )
                        ? [
                            account.defaultGradient.color1,
                            account.defaultGradient.color2,
                            account.defaultGradient.color3,
                            account.defaultGradient.color4,
                            account.defaultGradient.color5,
                          ]
                        : [account.userGradient.to, account.userGradient.from],
                    };
                  })()}
                />
                {userAccounts && (
                  <div
                    className={`absolute inset-0 left-0 top-full my-4 space-y-4 ${openAccountsDialog ? "z-10" : "-z-10"}`}
                  >
                    {userAccounts
                      .filter((acc) => acc.id !== account?.id)
                      .map((account, index) => (
                        <AccountPreviewCard
                          onClick={() => {
                            setUserMainAccountId(account.id);
                            setOpenAccountsDialog(false);
                          }}
                          wrapperClassName={`cursor-pointer transition-all duration-500 delay-[${index * 100}ms] ${openAccountsDialog ? "opacity-100 scale-105" : "opacity-0! scale-100"}`}
                          key={account.id}
                          name={account.name}
                          description={account.description || ""}
                          accountType={account.accountType.name}
                          currency={account.currency.code}
                          gradient={(() => {
                            return {
                              type: "default",
                              id:
                                account.defaultGradient?.id ||
                                account.userGradient?.id ||
                                0,
                              name:
                                account.defaultGradient?.name ||
                                account.userGradient?.name ||
                                "",
                              slug:
                                account.defaultGradient?.slug ||
                                account.userGradient?.slug ||
                                "",
                              colors: isDefaultGradientItem(
                                account.defaultGradient || account.userGradient
                              )
                                ? [
                                    account.defaultGradient.color1,
                                    account.defaultGradient.color2,
                                    account.defaultGradient.color3,
                                    account.defaultGradient.color4,
                                    account.defaultGradient.color5,
                                  ]
                                : [
                                    account.userGradient.to,
                                    account.userGradient.from,
                                  ],
                            };
                          })()}
                        />
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <EmptyAccountCard
                onClick={() => setOpenAccountsDialog(!openAccountsDialog)}
                wrapperClassName="z-10 cursor-pointer relative"
              />
            )}
          </AnimatePresence>
        </div>

        <Card className="grow border border-border py-4">
          <CardContent className="h-full flex flex-col">
            <h3 className="font-bold text-base mb-4">Account Information</h3>

            {account ? (
              <div className="flex-1 mt-3">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Name:
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {account.name}
                  </span>

                  {account.description && (
                    <>
                      <span className="text-sm font-semibold text-muted-foreground">
                        Description:
                      </span>
                      <span className="text-sm text-foreground">
                        {account.description}
                      </span>
                    </>
                  )}

                  <span className="text-sm font-semibold text-muted-foreground">
                    Type:
                  </span>
                  <span className="text-sm text-foreground">
                    {account.accountType.name}
                  </span>

                  <span className="text-sm font-semibold text-muted-foreground">
                    Currency:
                  </span>
                  <span className="text-sm text-foreground">
                    {account.currency.code} ({account.currency.symbol})
                  </span>

                  <span className="text-sm font-semibold text-muted-foreground">
                    Balance:
                  </span>
                  <span className="text-sm text-foreground font-semibold">
                    {formattedBalance} {account.currency.symbol}
                  </span>

                  <span className="text-sm font-semibold text-muted-foreground">
                    Created:
                  </span>
                  <span className="text-sm text-foreground">
                    {account.createdAt
                      ? new Date(account.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="my-auto flex flex-col items-center justify-center py-8">
                <CreditCard className="w-10 h-10 mx-auto opacity-50 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Please select an account
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Net This Month Card */}
        <Card className="grow border border-border py-4">
          <CardContent className="h-full flex flex-col justify-center">
            {account ? (
              <div className="flex flex-col items-center justify-center py-2">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Net This Month
                </p>
                <h3
                  className={`text-3xl font-bold ${
                    thisMonthNet >= 0 ? "text-green-500" : "text-error-600"
                  }`}
                >
                  {thisMonthNet >= 0 ? "+" : ""}
                  {thisMonthNet.toFixed(2)} {account.currency.symbol}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Income - Expenses
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <CreditCard className="w-8 h-8 opacity-50 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-2">
                  Select account
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card className="grow border border-border py-4">
          <CardContent className="h-full flex flex-col justify-center">
            {account ? (
              <div className="flex flex-col items-center justify-center py-2">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Income
                </p>
                <h3 className="text-2xl font-bold text-green-500">
                  {income?.toFixed(2) || "0.00"} {account.currency.symbol}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">This month</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <CreditCard className="w-8 h-8 opacity-50 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-2">
                  Select account
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="grow border border-border py-4">
          <CardContent className="h-full flex flex-col justify-center">
            {account ? (
              <div className="flex flex-col items-center justify-center py-2">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Expenses
                </p>
                <h3 className="text-2xl font-bold text-error-600">
                  {Math.abs(expenses || 0).toFixed(2)} {account.currency.symbol}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">This month</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <CreditCard className="w-8 h-8 opacity-50 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-2">
                  Select account
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Spending Category Card */}
        {topSpendingCategory && account && (
          <Card className="grow border border-border py-4">
            <CardContent className="h-full flex flex-col justify-center">
              <div className="flex flex-col items-center justify-center py-2">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Top Spending Category
                </p>
                <p className="text-sm font-semibold mb-2 text-foreground">
                  {topSpendingCategory.name}
                </p>
                <h3 className="text-xl font-bold text-error-600">
                  {topSpendingCategory.amount.toFixed(2)}{" "}
                  {account.currency.symbol}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">This month</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="col-span-3 w-full mt-2">
          {/* <SelectedCardDetails /> */}
          <SelectedCardTransactions />
        </div>
      </div>

      {openAccountsDialog && (
        <div
          onClick={() => setOpenAccountsDialog(false)}
          className="absolute inset-0 z-5 bg-black/50"
        ></div>
      )}

      {openDeleteAccountModal && account && (
        <ConfirmationModal
          open={openDeleteAccountModal}
          setOpen={setOpenDeleteAccountModal}
          description="Are you sure you want to delete this account?"
          mutation={(data: DeleteAccount) => {
            deleteAccount(data);
            return Promise.resolve(true);
          }}
          data={account}
          revalidateKeys={{ queryKey: ["userAccounts"] }}
          loading={false}
        />
      )}
    </BaseWrapper>
  );
}
