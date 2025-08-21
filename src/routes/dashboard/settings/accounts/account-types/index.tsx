import { ChevronLeftIcon, EllipsisVerticalIcon, PlusIcon, TrashIcon } from "@heroicons/react/16/solid";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type InvalidateQueryFilters,
  type UseMutateFunction,
} from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  deleteUserAccountType,
  getUserAccountTypes,
  type DeleteAccountType,
} from "../../../../../actions/accounts/userAccountTypes";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../../../../components/ui/dropdown-menu";
import ConfirmationModal from "../../../../../components/reusable/dialogs/ConfirmationModal";
import { Button } from "../../../../../components/ui/button";

export const Route = createFileRoute("/dashboard/settings/accounts/account-types/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedAccountType, setSelectedAccountType] = useState<number | null>(null);
  const [openDeleteAccountTypeModal, setOpenDeleteAccountTypeModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ["accountTypes"],
    queryFn: getUserAccountTypes,
  });

  const mutation = useMutation({
    mutationFn: (data: DeleteAccountType) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          deleteUserAccountType(data).then(resolve).catch(reject);
        }, 1000);
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["accountTypes"] });
      queryClient.invalidateQueries({ queryKey: ["accounts/accountTypes"] });
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedAccountType(0); // Set the first account type as selected by default
    } else {
      setSelectedAccountType(null); // Reset if no account types are available
    }
  }, [data]);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error loading account types</div>;

  return (
    <div className="p-6 mt-2">
      <div className="flex justify-between">
        <span
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.navigate({ to: "/dashboard/settings/accounts" })}
        >
          <ChevronLeftIcon className="h-6 w-6" />
          <h3>Account types</h3>
        </span>
        <Button
          size="sm"
          onClick={() => router.navigate({ to: "/dashboard/settings/accounts/account-types/create" })}
          className="text-sm px-3 py-2 flex items-center gap-0.5"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Create Account Type
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-10 mt-6">
        <div className="col-span-2">
          {selectedAccountType !== null && (
            <>
              <div className="flex items-center justify-between">
                <div className="font-bold">{data[selectedAccountType].name}</div>
                <div className="flex items-center gap-2">
                  {data[selectedAccountType].userId && (
                    <Button
                      size="sm"
                      onClick={() =>
                        router.navigate({
                          to: `/dashboard/settings/accounts/account-types/${data[selectedAccountType].id}`,
                        })
                      }
                    >
                      Edit
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="btn btn-sm flex gap-1.5 items-center">
                      Actions <EllipsisVerticalIcon className="w-4 h-4" />{" "}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded-md p-2">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Billing</DropdownMenuItem>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      {data[selectedAccountType].userId && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setOpenDeleteAccountTypeModal(true)}
                            className="focus:bg-error-800 text-error focus:text-error relative group overflow-hidden"
                          >
                            Delete
                            <TrashIcon className="fill-error-600 absolute transition-all duration-300 -right-6 opacity-0 group-hover:opacity-100 group-hover:right-2" />
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="bg-bg-main-light p-4 my-2 rounded-md text-main">
                <p>{data[selectedAccountType].description || "No description available."}</p>
              </div>
            </>
          )}
        </div>
        <div className="col-span-1">
          {data.length > 0 &&
            data.map((accountType, index) => (
              <div
                onClick={() => setSelectedAccountType(index)}
                className={`cursor-pointer hover:border-bg-main bg-bg-main-light p-4 mb-2.5 rounded-md border-2 border-transparent text-main flex justify-between
                  
                  ${selectedAccountType === index ? "border-2 !border-main" : ""}`}
              >
                <div>{accountType.name}</div>
              </div>
            ))}
        </div>
      </div>
      {selectedAccountType !== null && (
        <ConfirmationModal
          description={
            <span>
              You are about to delete <span className="font-bold">{data[selectedAccountType].name}</span> account type
            </span>
          }
          loading={mutation.isPending}
          revalidateKeys={["accountTypes"] as InvalidateQueryFilters}
          mutation={mutation.mutate as UseMutateFunction<boolean, Error, DeleteAccountType, unknown>}
          data={{ id: data[selectedAccountType].id }}
          setOpen={setOpenDeleteAccountTypeModal}
          open={openDeleteAccountTypeModal}
        />
      )}
    </div>
  );
}
