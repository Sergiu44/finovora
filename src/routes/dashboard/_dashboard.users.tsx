import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_dashboard/users")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/users"!</div>;
}
