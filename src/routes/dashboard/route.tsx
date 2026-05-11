import { createFileRoute } from "@tanstack/react-router";
import "../../styles/dashboard.css";
import RouteWrapper from "./-components/RouteWrapper";
import Sidebar from "./-components/Sidebar";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RouteWrapper>
      <Sidebar />
    </RouteWrapper>
  );
}
