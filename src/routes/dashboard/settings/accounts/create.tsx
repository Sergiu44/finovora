import { createFileRoute } from "@tanstack/react-router";
import UpdateCreateAccount from "./-components/UpdateCreateAccount";
import { getDefaultGradientsAsync } from "../../../../utils/actions/nomenclatures/defaultGradient";

export const Route = createFileRoute("/dashboard/settings/accounts/create")({
  component: RouteComponent,
  loader: () => getDefaultGradientsAsync(),
});

function RouteComponent() {
  return <UpdateCreateAccount />;
}
