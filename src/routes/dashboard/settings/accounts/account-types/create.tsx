import { createFileRoute } from "@tanstack/react-router";
import UpdateCreateAccountType from "./-components/UpdateCreateAccountType";

export const Route = createFileRoute("/dashboard/settings/accounts/account-types/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UpdateCreateAccountType />;
}
