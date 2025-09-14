import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";

export const Route = createFileRoute("/dashboard/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.navigate({ to: `/dashboard/settings/${value}` });
  };
  return (
    <>
      <h1 className="text-2xl font-bold">Settings</h1>
      <Tabs defaultValue="profile" className="w-[400px] my-2">
        <TabsList>
          <TabsTrigger onClick={() => handleTabChange("profile")} value="profile">
            Profile
          </TabsTrigger>
          <TabsTrigger onClick={() => handleTabChange("accounts")} value="account">
            Accounts
          </TabsTrigger>
          <TabsTrigger onClick={() => handleTabChange("security")} value="security">
            Security
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Outlet />
    </>
  );
}
