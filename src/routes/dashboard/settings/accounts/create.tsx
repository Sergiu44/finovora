import { createFileRoute } from "@tanstack/react-router";
import UpdateCreateAccount from "./-components/UpdateCreateAccount";

export const Route = createFileRoute("/dashboard/settings/accounts/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UpdateCreateAccount />;
}
