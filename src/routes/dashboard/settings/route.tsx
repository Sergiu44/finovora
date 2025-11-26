import { createFileRoute, Outlet } from "@tanstack/react-router";
import IconLink from "../../../components/reusable/IconLink";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/16/solid";
import { BellPlus, CreditCard, File, UserCircle, Wrench } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-[150px_1fr] lg:grid-cols-[250px_1fr] min-h-[calc(100vh-64px)]">
      <div className="px-3 pt-6 m-2 max-h-[calc(100vh-84px)] sticky top-2 rounded-[4px]">
        <h3 className="text-sm font-semibold text-left pl-2">
          Profile Management
        </h3>
        <div className="flex flex-col items-center gap-1 mt-2">
          <IconLink
            variant="slim"
            icon={<UserCircle className="w-3 h-3" />}
            text="Details"
            href="/dashboard/settings/profile"
          />
          <IconLink
            variant="slim"
            icon={<BellPlus className="w-3 h-3" />}
            text="Notifications"
            href="/dashboard/settings/notifications"
          />
          <IconLink
            variant="slim"
            icon={<CreditCard className="w-3 h-3" />}
            text="Subscriptions"
            href="/dashboard/settings/subscriptions"
          />
        </div>

        <h3 className="text-sm font-semibold text-left mt-4 pl-2">
          Accounts Mangement
        </h3>
        <div className="flex flex-col items-center gap-1 mt-2">
          <IconLink
            variant="slim"
            icon={<File className="w-3 h-3" />}
            text="Accounts"
            href="/dashboard/settings/accounts"
          />
          <IconLink
            variant="slim"
            icon={<ArrowPathRoundedSquareIcon />}
            text="Recursive Transactions"
            href="/dashboard/settings/recursive-transactions"
          />
        </div>

        <h3 className="text-sm font-semibold text-left mt-4 pl-2">Others</h3>
        <div className="flex flex-col items-center gap-1 mt-2">
          <IconLink
            variant="slim"
            icon={<Wrench className="w-3 h-3" />}
            text="Security"
            href="/dashboard/settings/security"
          />
        </div>
      </div>
      <div className="border-l border-border">
        <div className="mx-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
