import { createFileRoute, useParams, useRouteContext } from "@tanstack/react-router";
import UpdateCreateAccount from "../../-components/UpdateCreateAccount";
import { useEffect, useState } from "react";
import { createEnhancedAxios } from "../../../../../../configs/axios";

export const Route = createFileRoute("/dashboard/settings/accounts/edit/$accountId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = useParams({ from: "/dashboard/settings/accounts/edit/$accountId" }) as { accountId: string };
  const [data, setData] = useState();

  useEffect(() => {
    if (params.accountId === undefined) {
      throw new Error("Account ID is required");
    }
    const fetchAccountData = async () => {
      // Fetch account data based on accountId if needed
      // This can be done using a query or any other method
      const res = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/accounts/${params.accountId}`);
      if (res.status !== 200) {
        throw new Error("Failed to fetch account data");
      }

      setData(res.data);
    };
    fetchAccountData();
  }, [params.accountId]);
  return <UpdateCreateAccount id={params.accountId} data={data} />;
}
