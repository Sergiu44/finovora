import { createFileRoute } from "@tanstack/react-router";
import GridCard from "../../components/GridCard";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <GridCard title={{ inside: false, text: "Test" }}>test</GridCard>

      <GridCard
        wrapperClassname={"col-span-2"}
        size="lg"
        title={{ inside: true, text: "Test" }}
      >
        test
      </GridCard>
    </div>
  );
}
