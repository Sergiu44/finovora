import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { deleteUserAccount, getUserCardAccounts, type DeleteAccount } from "../../utils/actions/accounts/userAccounts";
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
      .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
  }, [account?.transactions]);

  return (
    <BaseWrapper>
      <h1 className="text-3xl font-bold ml-2.5">Dashboard</h1>
      <p className="text-sm text-muted-foreground ml-2.5">Easy way to manage your finances</p>

      <Card className="border-border mt-4 py-2">
        <CardContent className="px-2">
          <Button
            type="button"
            variant="ghost-destructive"
            className="w-full justify-start transition-none rounded-[8px]!"
            size="xs"
            onClick={() => setOpenDeleteAccountModal(true)}
          >
            <TrashIcon /> Delete account
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-[minmax(250px,350px)_1fr_1fr] gap-4 mt-4">
        <div className={`rounded-[12px] shadow-lg relative`}>
          <AnimatePresence mode="wait">
            {account ? (
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
                    id: account.defaultGradient?.id || account.userGradient?.id || 0,
                    name: account.defaultGradient?.name || account.userGradient?.name || "",
                    slug: account.defaultGradient?.slug || account.userGradient?.slug || "",

                    colors: isDefaultGradientItem(account.defaultGradient || account.userGradient)
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
            ) : (
              <EmptyAccountCard
                onClick={() => setOpenAccountsDialog(!openAccountsDialog)}
                wrapperClassName="z-10 cursor-pointer relative"
              />
            )}
          </AnimatePresence>
          {userAccounts && (
            <div className={`absolute inset-0 left-0 top-full my-4 space-y-4 ${openAccountsDialog ? "z-10" : "-z-10"}`}>
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
                        id: account.defaultGradient?.id || account.userGradient?.id || 0,
                        name: account.defaultGradient?.name || account.userGradient?.name || "",
                        slug: account.defaultGradient?.slug || account.userGradient?.slug || "",
                        colors: isDefaultGradientItem(account.defaultGradient || account.userGradient)
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
                ))}
            </div>
          )}
        </div>

        <Card className="border border-border pt-4 pb-0 h-[200px]">
          <CardContent>
            <h3 className="font-bold mb-2 block">Account information</h3>

            <div className="mt-4 grid grid-cols-[2fr_1fr] gap-1">
              <span className="text-sm font-semibold text-muted-foreground">Account name</span>
              <span className="text-sm text-muted-foreground">{account?.name}</span>

              <span className="text-sm font-semibold text-muted-foreground">Account type</span>
              <span className="text-sm text-muted-foreground">{account?.accountType.name}</span>

              <span className="text-sm font-semibold text-muted-foreground">Currency</span>
              <span className="text-sm text-muted-foreground">
                {account?.currency.code} ({account?.currency.symbol})
              </span>

              <span className="text-sm font-semibold text-muted-foreground">Created at</span>
              <span className="text-sm text-muted-foreground">
                {account?.createdAt ? new Date(account.createdAt).toLocaleDateString() : ""}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent>
            <h3 className="font-bold mb-2 block">Billing details</h3>
            <p className="text-xs">The percentages are relative to last month</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex flex-col items-center">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-green-500">{income?.toFixed(2)}</h3>
                  {!!account?.incomePercentage && (
                    <span className="grid items-center text-center h-full rounded-md px-1.5 py-2 text-xs text-green-800 bg-green-300">
                      {account?.incomePercentage > 0 && "+"}
                      {account?.incomePercentage?.toFixed(2)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-4">Income</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  <h3 className="text-xl font-bold text-error-600">{expenses?.toFixed(2)}</h3>
                  {!!account?.expensePercentage && (
                    <span className="grid items-center h-full rounded-md px-1.5 text-xs text-error-300 bg-error-700">
                      {account?.expensePercentage > 0 && "+"}
                      {account?.expensePercentage.toFixed(2)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-4">Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-3">
          {/* <SelectedCardDetails /> */}
          <SelectedCardTransactions />
        </div>
      </div>

      {openAccountsDialog && (
        <div onClick={() => setOpenAccountsDialog(false)} className="absolute inset-0 z-5 bg-black/50"></div>
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
