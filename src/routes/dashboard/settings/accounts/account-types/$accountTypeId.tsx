import { createFileRoute, Router, useLoaderData, useParams } from "@tanstack/react-router";
import { createEnhancedAxios } from "../../../../../configs/axios";
import UpdateCreateAccountType from "./-components/UpdateCreateAccountType";
import { getUserAccountType } from "../../../../../utils/actions/accounts/userAccountTypes";

export const Route = createFileRoute("/dashboard/settings/accounts/account-types/$accountTypeId")({
  component: RouteComponent,
  gcTime: 0,
  loader: async ({ params }) => {
    return getUserAccountType(params.accountTypeId);
  },
});

function RouteComponent() {
  const { accountTypeId } = useParams({ strict: false });
  const data = useLoaderData({
    from: "/dashboard/settings/accounts/account-types/$accountTypeId",
  });
  return <UpdateCreateAccountType data={data} id={accountTypeId} />;
}
