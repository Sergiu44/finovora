import { createFileRoute } from "@tanstack/react-router";
import BaseWrapper from "../../../components/reusable/layouts/BaseWrapper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserCurrenciesAsync,
  setPrimaryCurrencyAsync,
  deleteUserCurrencyAsync,
} from "../../../utils/actions/users/userCurrencies";
import EmptyCard from "../settings/accounts/-components/EmptyCard";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import AddUserCurrencyModal from "./-components/AddUserCurrencyModal";
import ReactCountryFlag from "react-country-flag";
import { BadgeCheck, Star, TrashIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/currencies/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [openAddCurrencyModal, setOpenAddCurrencyModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["user-currencies"],
    queryFn: () => getUserCurrenciesAsync(),
  });

  const { mutate: setPrimary, isPending: isSettingPrimary } = useMutation({
    mutationFn: (userCurrencyId: number) =>
      setPrimaryCurrencyAsync(userCurrencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-currencies"] });
      toast.success("Primary currency updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to set primary currency"
      );
    },
  });

  const { mutate: deleteCurrency, isPending: isDeleting } = useMutation({
    mutationFn: (userCurrencyId: number) =>
      deleteUserCurrencyAsync(userCurrencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-currencies"] });
      toast.success("Currency removed successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove currency"
      );
    },
  });

  const primaryCurrencyCode = data?.primaryCurrency;
  const currencies = data?.items || [];

  return (
    <>
      <BaseWrapper>
        <div className="mb-4">
          <h1 className="text-3xl font-bold">My Currencies</h1>
          <p className="text-sm text-muted-foreground">
            Add currencies to track and compare exchange rates
          </p>
        </div>

        {isLoading && <div>Loading...</div>}
        {!isLoading && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currencies.map((item: any) => {
              const rate = item.rateToPrimary || 1;
              const isPrimary =
                item.isPrimary || item.currency.code === primaryCurrencyCode;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col p-6 rounded-[16px] border bg-card hover:border-primary/50 transition-all duration-200 h-[180px] ${
                    isPrimary
                      ? "border-primary/50 bg-primary/5"
                      : "border-muted-foreground/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">
                        <ReactCountryFlag
                          countryCode={item.currency.countryCode}
                        />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold">
                            {item.currency.code}
                          </div>
                          {isPrimary && (
                            <Star className="h-4 w-4 text-primary fill-primary" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.currency.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {`RATE TO ${primaryCurrencyCode || item.currency.code}`}
                      </div>
                      <div className="text-2xl font-bold">
                        {rate.toFixed(4)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isPrimary && (
                        <div
                          onClick={() =>
                            !isSettingPrimary &&
                            !isDeleting &&
                            setPrimary(item.id)
                          }
                          className={`group h-8 w-8 rounded-full hover:bg-primary transition-colors duration-300 flex items-center justify-center ${
                            isSettingPrimary || isDeleting
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }`}
                          title="Set as primary"
                        >
                          <BadgeCheck className="h-4 w-4 group-hover:text-white transition-colors duration-300 text-muted-foreground" />
                        </div>
                      )}

                      {isPrimary ? (
                        <div
                          className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center cursor-not-allowed opacity-50"
                          title="Primary currency cannot be removed"
                        >
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            !isSettingPrimary &&
                            !isDeleting &&
                            deleteCurrency(item.id)
                          }
                          className={`group h-8 w-8 rounded-full hover:bg-error-600 transition-colors duration-300 flex items-center justify-center ${
                            isSettingPrimary || isDeleting
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }`}
                          title="Remove currency"
                        >
                          <TrashIcon className="h-4 w-4 group-hover:text-white transition-colors duration-300 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Placeholder empty card for adding a new currency */}
            <div className="group">
              <EmptyCard
                text="Add a new currency"
                icon={
                  <PlusIcon className="w-8 h-8 mx-auto mb-2 text-primary p-1 bg-primary/20 rounded-full opacity-65 group-hover:opacity-100 group-hover:bg-primary/20 transition-all duration-300" />
                }
                onClick={() => setOpenAddCurrencyModal(true)}
                wrapperClassName="[&>div]:rounded-[16px]! hover:[&>div]:bg-primary/10 hover:[&>div]:border-primary/75 select-none [&>div]:h-[180px]! [&_p]:text-primary! [&_p]:font-medium! [&_p]:opacity-65! group-hover:[&_p]:opacity-100! transition-all duration-300 cursor-pointer"
              />
            </div>
          </div>
        )}
      </BaseWrapper>
      {openAddCurrencyModal && (
        <AddUserCurrencyModal
          open={openAddCurrencyModal}
          setOpen={setOpenAddCurrencyModal}
        />
      )}
    </>
  );
}
