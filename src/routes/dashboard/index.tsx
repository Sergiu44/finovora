import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "../../components/ui/card";
import { type DeleteAccount } from "../../utils/actions/accounts/userAccounts";
import { useQueryClient } from "@tanstack/react-query";
import AccountPreviewCard from "./settings/accounts/-components/AccountPreviewCard";
import EmptyCard from "../../components/reusable/cards/EmptyCard/EmptyCard";
import { isDefaultGradientItem } from "../../utils/actions/nomenclatures/defaultGradient";

import ConfirmationModal from "../../components/reusable/dialogs/ConfirmationModal";
import BaseWrapper from "../../components/reusable/layouts/BaseWrapper";
import { TrashIcon } from "@heroicons/react/24/outline";
import SelectedCardTransactions from "./-components/SelectedCardTransactions";
import { ArrowLeftRightIcon, CreditCard } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import { useDashboard, useDashboardTransformers } from "./-hook";
import TransactionPeriodSummary from "./-components/TransactionPeriodSummary";
import { useTransactionsPreferences } from "../../context/TransactionsPreferences";
import { format } from "date-fns/format";
import { useMemo } from "react";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const {
    account,
    deleteAccount,
    isRemoving,
    openDeleteAccountModal,
    userAccounts,
    setOpenDeleteAccountModal,
    setUserMainAccountId,
  } = useDashboard({ queryClient });

  const {
    formattedBalance,
    thisMonthNet,
    topSpendingCategory,
    income,
    expenses,
  } = useDashboardTransformers({ account });

  const { currentDate, currentDateRange, setCurrentDate } =
    useTransactionsPreferences();
  const rangeLabel = useMemo(() => {
    if (!currentDateRange.from || !currentDateRange.to) {
      return "";
    }
    return `${format(currentDateRange.from, "MMM dd")} – ${format(
      currentDateRange.to,
      "MMM dd",
    )}`;
  }, [currentDateRange.from, currentDateRange.to]);

  return (
    <BaseWrapper title="Dashboard" subtitle="Easy way to manage your finances">
      <div className="grid grid-cols-[3fr_1fr] gap-6 mt-4">
        <TransactionPeriodSummary
          className="col-span-2"
          monthValue={currentDate}
          periodLabel={rangeLabel}
          onChangeMonth={(val: Date) => setCurrentDate(val)}
        />
        <div className="relative">
          <Drawer direction="right">
            {account ? (
              <div className="relative">
                <AccountPreviewCard
                  icons={[
                    <TrashIcon
                      className="w-8 h-8 p-2 hover:bg-white/30 rounded-full bg-white/10"
                      onClick={() => setOpenDeleteAccountModal(true)}
                    />,
                    <DrawerTrigger asChild>
                      <ArrowLeftRightIcon className="w-8 h-8 p-2 hover:bg-white/30 rounded-full bg-white/10" />
                    </DrawerTrigger>,
                  ]}
                  isRemoving={isRemoving}
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
                        account.defaultGradient || account.userGradient,
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
              </div>
            ) : (
              <EmptyCard.Root wrapperClassName="z-10 cursor-pointer relative" />
            )}

            <DrawerContent className="bg-white focus:border-none border-none focus:outline-none outline-none">
              <div className="mx-auto w-full">
                <DrawerHeader>
                  <DrawerTitle>Select account</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  {userAccounts &&
                    userAccounts.filter((acc) => acc.id !== account?.id)
                      .length > 0 &&
                    userAccounts
                      .filter((acc) => acc.id !== account?.id)
                      .map((account, index) => {
                        return (
                          <AccountPreviewCard
                            onClick={() => {
                              setUserMainAccountId(account.id);
                            }}
                            wrapperClassName={`cursor-pointer transition-all duration-500 delay-[${index * 100}ms]`}
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
                                  account.defaultGradient ||
                                    account.userGradient,
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
                        );
                      })}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        <Card className="border border-border py-4">
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
                          },
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
        <Card className="border border-border py-4">
          <CardContent className="h-full flex flex-col justify-center">
            {account ? (
              <div className="flex flex-col items-center justify-center py-2">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Net This Month
                </p>
                <h3
                  className={`text-3xl font-bold ${thisMonthNet >= 0 ? "text-green-500" : "text-error-600"}`}
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
        <Card className="border border-border py-4">
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
      </div>
      <div className="col-span-3 w-full mt-2">
        {/* <SelectedCardDetails /> */}
        <SelectedCardTransactions />
      </div>
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
