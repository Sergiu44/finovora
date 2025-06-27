import { createFileRoute, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserAccountTypes } from "../../../../actions/accounts/getUserAccountTypes";
import { Separator } from "../../../../components/ui/separator";
import { ArrowRightIcon, LockClosedIcon } from "@heroicons/react/16/solid";
export const Route = createFileRoute("/dashboard/settings/accounts")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const router = useRouter();
  const { data, status } = useQuery({
    queryKey: ["accountsTypes"],
    queryFn: getUserAccountTypes,
  });

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error loading account types</div>;
  return location.pathname.endsWith("accounts") ? (
    <div className="mt-8 flex flex-col gap-y-6">
      <div className="grid grid-cols-[minmax(250px,max(20%,250px))_1fr] p-4">
        <p className="font-bold">Accounts</p>
        <div className="w-full bg-bg-main rounded-md p-8">test</div>
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
            {data.length > 0 &&
              data.map((accountType) => (
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
    </div>
  ) : (
    <Outlet />
  );
}
