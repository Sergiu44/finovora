import {
  createFileRoute,
  Outlet,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type InvalidateQueryFilters,
  type UseMutateFunction,
} from "@tanstack/react-query";
import { getUserAccountTypes } from "../../../../utils/actions/accounts/userAccountTypes";
import { Separator } from "../../../../components/ui/separator";
import {
  ArrowRightIcon,
  LockClosedIcon,
} from "@heroicons/react/16/solid";
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
import { Pencil, PlusIcon, Trash } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings/accounts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [defaultAccountId, setDefaultAccountId] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<{
    id: number;
    name: string;
    accountTypeName: string;
  } | null>(null);
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);

  const location = useLocation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ["accounts/accountTypes"],
    queryFn: async () => {
      return Promise.all([
        getUserAccountTypes(),
        getUserAccountsGroupedByAccountTypes(),
      ]);
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
    <div className="mt-2 flex flex-col gap-y-4">
      <div className="grid grid-cols-[minmax(250px,max(20%,250px))_1fr] py-4">
        <div className="flex items-baseline justify-between col-span-2">
          <p className="font-semibold text-xl col-span-2">Accounts</p>
          <Button
            size="sm"
            onClick={() =>
              router.navigate({ to: "/dashboard/settings/accounts/create" })
            }
          >
            <PlusIcon className="h-3 w-3" /> Add new account
          </Button>
        </div>
        <Card className="w-full mt-2 col-span-2 py-2 pl-6 relative border-muted bg-card">
              <div className="grid mx-6 text-sm text-muted-foreground/40 grid-cols-[20px_50px_1fr_100px_100px_50px] pr-8">
                <div></div>
                <div>Name</div>
                <div>Description</div>
                <div>Balance</div>
                <div>Created at</div>
                <div>Actions</div>  
              </div>
          {Object.keys(data[1]).length > 0 ? (
            <div className="flex flex-col gap-2 h-[400px] overflow-y-auto">
              {Object.keys(data[1]).map((accountType) => (
                <div key={data[1][accountType].accountTypeId}>
                  <div key={data[1][accountType].accountTypeId} className="p-2">
                    <h4 className="">{accountType}</h4>
                    <div className="flex flex-col gap-2 mx-4">
                      {data[1][accountType].accounts.length > 0 ? (
                        data[1][accountType].accounts.map((account) => (
                          <div className="my-4 grid grid-cols-[20px_50px_1fr_100px_100px_50px]" key={account.id}>
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
                                  <div className="font-medium">{account.name}</div>
                                  <span className="text-sm text-muted-foreground!">
                                    {account.description || "-"}
                                  </span>
                              <div>
                                {account.balance.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: account.currency.symbol,
                                })}{" "}
                                {account.currency.symbol}
                              </div>
                              <span>{new Date(account.createdAt).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                              <Pencil
                                className="w-3.5 h-3.5 cursor-pointer"
                                onClick={() =>
                                  router.navigate({
                                    to: `/dashboard/settings/accounts/edit/${account.id}`,
                                  })
                                }
                              />
                              <Trash
                                className="w-3.5 h-3.5 cursor-pointer hover:text-error-700 transition-all ease-in-out duration-200"
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
                        <span className="text-center p-8 text-muted-foreground/40">
                          No accounts found for this group
                        </span>
                      )}
                    </div>
                  </div>
                  <Separator className="border-border" />
                </div>
              ))}
            </div>
          ) : (
            <div>No accounts found</div>
          )}

          {defaultAccountId !== null && (
            <div className="absolute bottom-4 right-6">
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
      <Separator className="col-span-2 border-border !h-[1.5px]" />

      <div className="grid grid-cols-[minmax(250px,max(20%,250px))_1fr_1fr] p-4">
        <div className="col-span-2">
          <p className="font-bold">Account Types</p>
          <span className="">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus,
            nisi.
          </span>
        </div>
        <div className="flex flex-col">
          <div className="w-full bg-bg-main rounded-md px-4 py-2 h-[350px] overflow-y-auto">
            {data[0].length > 0 &&
              data[0].map((accountType) => (
                <div className="bg-muted p-4 my-2 rounded-md  flex justify-between">
                  <div>{accountType.name}</div>
                  {!accountType.userId && (
                    <LockClosedIcon className="h-4 w-4" />
                  )}
                </div>
              ))}
          </div>
          <span
            className="cursor-pointer mt-6 self-end btn-underline btn-sm flex gap-1 hover:gap-2 transition-all ease-in-out duration-200 items-center"
            onClick={() =>
              router.navigate({
                to: "/dashboard/settings/accounts/account-types",
              })
            }
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
              You are about to delete{" "}
              <span className="font-bold">{selectedAccount.name}</span> account
              from <span>{selectedAccount.accountTypeName}</span> account type
              group
            </span>
          }
          loading={mutation.isPending}
          revalidateKeys={["accountTypes"] as InvalidateQueryFilters}
          mutation={
            mutation.mutate as UseMutateFunction<
              boolean,
              Error,
              DeleteAccount,
              unknown
            >
          }
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
