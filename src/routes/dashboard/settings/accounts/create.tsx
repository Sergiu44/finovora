import { createFileRoute } from "@tanstack/react-router";
import UpdateCreateAccount from "./-components/UpdateCreateAccount";
import { getDefaultGradientsAsync } from "../../../../utils/actions/nomenclatures/defaultGradient";
import { getUserGradientsAsync } from "../../../../utils/actions/users/userGradients";

export const Route = createFileRoute("/dashboard/settings/accounts/create")({
  component: RouteComponent,
  loader: () => {
    return Promise.all([getDefaultGradientsAsync(), getUserGradientsAsync()]);
  },
});

function RouteComponent() {
  return <UpdateCreateAccount />;
}
