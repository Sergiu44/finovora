import { createFileRoute, Outlet } from "@tanstack/react-router";
import IconLink from "../../../components/reusable/IconLink";
import {
  ArrowPathRoundedSquareIcon,
  Cog6ToothIcon,
} from "@heroicons/react/16/solid";

export const Route = createFileRoute("/dashboard/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-[250px_1fr] min-h-[calc(100vh-64px)]">
      <div className="px-4 pt-12 bg-sidebar dark:bg-sidebar/60">
        <h3 className="text-md font-bold text-left pl-2">Manage</h3>
        <div className="flex flex-col items-center gap-0.5 mt-2">
          <IconLink
            variant="slim"
            icon={<Cog6ToothIcon />}
            text="Profile"
            href="/dashboard/settings/profile"
          />
          <IconLink
            variant="slim"
            icon={<Cog6ToothIcon />}
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

        <h3 className="text-md font-bold text-left mt-4 pl-2">Security</h3>
        <div className="flex flex-col items-center gap-1 mt-2">
          <IconLink
            variant="slim"
            icon={<Cog6ToothIcon />}
            text="Security"
            href="/dashboard/settings/security"
          />
        </div>
      </div>
      <div className="border-l border-border">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
