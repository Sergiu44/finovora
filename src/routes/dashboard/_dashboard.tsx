import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <button>Hello "/dashboard/_dashboard"!</button>
      <Outlet />
    </div>
  );
}
