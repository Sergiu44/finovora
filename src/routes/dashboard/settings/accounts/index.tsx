import { createFileRoute, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type InvalidateQueryFilters,
  type UseMutateFunction,
} from "@tanstack/react-query";
import { getUserAccountTypes, type DeleteAccountType } from "../../../../utils/actions/accounts/userAccountTypes";
import { Separator } from "../../../../components/ui/separator";
import { ArrowRightIcon, LockClosedIcon, PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import {
  deleteUserAccount,
  getUserAccountsGroupedByAccountTypes,
  setUserAccountAsDefault,
  type DeleteAccount,
} from "../../../../utils/actions/accounts/userAccounts";
import ConfirmationModal from "../../../../components/reusable/dialogs/ConfirmationModal";
import { useState } from "react";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";

export const Route = createFileRoute("/dashboard/settings/accounts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [defaultAccountId, setDefaultAccountId] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<{ id: number; name: string; accountTypeName: string } | null>(
    null
  );
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);

  const location = useLocation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ["accounts/accountTypes"],
    queryFn: async () => {
      return Promise.all([getUserAccountTypes(), getUserAccountsGroupedByAccountTypes()]);
    },
  });

  const defaultAccountMutation = useMutation({
    mutationKey: ["defaultAccount"],
    mutationFn: (accountId: number) => {
      return setUserAccountAsDefault(accountId);
    },
    onSuccess() {
      // Invalidate queries to refresh data after setting default account
      queryClient.invalidateQueries({ queryKey: ["accounts/accountTypes"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const mutation = useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: (account: DeleteAccount) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          deleteUserAccount({ id: account.id }).then(resolve).catch(reject);
        }, 1000);
      });
    },
    onSuccess() {
      // Invalidate queries to refresh data after deletion
      queryClient.invalidateQueries({ queryKey: ["accounts/accountTypes"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error loading account types</div>;
  return location.pathname.endsWith("accounts") ? (
    <div className="mt-8 flex flex-col gap-y-6">
      <div className="grid grid-cols-[minmax(250px,max(20%,250px))_1fr] p-4">
        <div className="flex items-baseline justify-between col-span-2">
          <p className="font-bold col-span-2">Accounts</p>
          <Button size="sm" onClick={() => router.navigate({ to: "/dashboard/settings/accounts/create" })}>
            Add new account
          </Button>
        </div>
        <Card className="w-full  mt-4 col-span-2 rounded-md p-8 relative border-muted bg-card">
          {Object.keys(data[1]).length > 0 ? (
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {Object.keys(data[1]).map((accountType) => (
                <div key={data[1][accountType].accountTypeId}>
                  <div key={data[1][accountType].accountTypeId} className="p-4">
                    <h4>{accountType}</h4>
                    <div className="flex flex-col gap-2">
                      {data[1][accountType].accounts.length > 0 ? (
                        data[1][accountType].accounts.map((account) => (
                          <div className="my-6 flex gap-8" key={account.id}>
                            <div className="flex grow items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <Checkbox
                                  checked={defaultAccountId === account.id}
                                  onCheckedChange={(e) => {
                                    if (e) {
                                      setDefaultAccountId(account.id);
                                    } else {
                                      setDefaultAccountId(null);
                                    }
                                  }}
                                />
                                <div>
                                  <div className="text-xl">{account.name}</div>
                                  <span className="text-main">{account.description}</span>
                                </div>
                              </div>

                              <div className="text-lg">
                                {account.balance.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: account.currency.symbol,
                                })}{" "}
                                {account.currency.symbol}
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <PencilIcon
                                className="w-6 h-6 cursor-pointer"
                                onClick={() =>
                                  router.navigate({ to: `/dashboard/settings/accounts/edit/${account.id}` })
                                }
                              />
                              <TrashIcon
                                className="w-6 h-6 cursor-pointer hover:text-error-700 transition-all ease-in-out duration-200"
                                onClick={() => {
                                  setSelectedAccount({
                                    id: account.id,
                                    name: account.name,
                                    accountTypeName: accountType,
                                  });
                                  setOpenDeleteAccountModal(true);
                                }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-center p-12 text-main">No accounts found for this group</span>
                      )}
                    </div>
                  </div>
                  <hr className="border-border" />
                </div>
              ))}
            </div>
          ) : (
            <div>No accounts found</div>
          )}

          {defaultAccountId !== null && (
            <div className="absolute bottom-12 right-16">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  defaultAccountMutation.mutate(defaultAccountId);
                }}
              >
                Save default account
              </Button>
            </div>
          )}
        </Card>
      </div>
      <Separator className="col-span-2 bg-bg-main-light !h-[1.5px]" />

      <div className="grid grid-cols-[minmax(250px,max(20%,250px))_1fr_1fr] p-4">
        <div className="col-span-2">
          <p className="font-bold">Account Types</p>
          <span className="text-main-washed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus, nisi.
          </span>
        </div>
        <div className="flex flex-col">
          <div className="w-full bg-bg-main rounded-md px-4 py-2 h-[350px] overflow-y-auto">
            {data[0].length > 0 &&
              data[0].map((accountType) => (
                <div className="bg-bg-main-light p-4 my-2 rounded-md text-main flex justify-between">
                  <div>{accountType.name}</div>
                  {!accountType.userId && <LockClosedIcon className="h-4 w-4" />}
                </div>
              ))}
          </div>
          <span
            className="cursor-pointer mt-6 self-end btn-underline btn-sm flex gap-1 hover:gap-2 transition-all ease-in-out duration-200 items-center"
            onClick={() => router.navigate({ to: "/dashboard/settings/accounts/account-types" })}
          >
            Manage account types
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
      <Separator className="col-span-2 bg-bg-main-light !h-[1.5px]" />

      {selectedAccount !== null && (
        <ConfirmationModal
          description={
            <span>
              You are about to delete <span className="font-bold">{selectedAccount.name}</span> account from{" "}
              <span>{selectedAccount.accountTypeName}</span> account type group
            </span>
          }
          loading={mutation.isPending}
          revalidateKeys={["accountTypes"] as InvalidateQueryFilters}
          mutation={mutation.mutate as UseMutateFunction<boolean, Error, DeleteAccount, unknown>}
          data={{ id: selectedAccount.id }}
          setOpen={setOpenDeleteAccountModal}
          open={openDeleteAccountModal}
        />
      )}
    </div>
  ) : (
    <Outlet />
  );
}
