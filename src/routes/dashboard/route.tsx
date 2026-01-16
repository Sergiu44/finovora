import { createFileRoute } from "@tanstack/react-router";
import "../../styles/dashboard.css";
import RouteWrapper from "./-index-components/RouteWrapper";
import Sidebar from "./-index-components/Sidebar";

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
