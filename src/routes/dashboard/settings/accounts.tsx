import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/accounts")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/settings/route/accounts"!</div>;
}
