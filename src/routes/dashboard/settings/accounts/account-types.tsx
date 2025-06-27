import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { getUserAccountTypes } from "../../../../actions/accounts/getUserAccountTypes";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard/settings/accounts/account-types")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedAccountType, setSelectedAccountType] = useState<number | null>(null);
  const router = useRouter();
  const { data, status } = useQuery({
    queryKey: ["accountsTypes"],
    queryFn: getUserAccountTypes,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedAccountType(0); // Set the first account type as selected by default
    } else {
      setSelectedAccountType(null); // Reset if no account types are available
    }
  }, []);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error loading account types</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <span
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.navigate({ to: "/dashboard/settings/accounts" })}
        >
          <ChevronLeftIcon className="h-6 w-6" />
          <h3>Account types</h3>
        </span>
        <button
          onClick={() => router.navigate({ to: "/dashboard/settings/accounts/account-types-create" })}
          className="btn btn-sm text-sm px-3 py-2 flex items-center gap-0.5"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Create Account Type
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="col-span-2">
          {selectedAccountType !== null && (
            <>
              <h4 className="font-bold">{data[selectedAccountType].name}</h4>
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
                className={`cursor-pointer hover:border-bg-main bg-bg-main-light p-4 my-2 rounded-md border-2 border-transparent text-main flex justify-between
                  
                  ${selectedAccountType === index ? "border-2 !border-main" : ""}`}
              >
                <div>{accountType.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
