import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_dashboard/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <h1>
      Hello "/dashboard/profile"! <button className="btn btn-sm">Test</button>
      <button className="btn">test</button>
    </h1>
  );
}
