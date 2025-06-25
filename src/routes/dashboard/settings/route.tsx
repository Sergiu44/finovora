import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

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
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger onClick={() => handleTabChange("accounts")} value="account">
            Manage accounts
          </TabsTrigger>
          <TabsTrigger onClick={() => handleTabChange("security")} value="security">
            Security
          </TabsTrigger>
        </TabsList>
        <Outlet />
      </Tabs>
    </>
  );
}
