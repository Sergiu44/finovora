import { createFileRoute, Outlet } from "@tanstack/react-router";
import Auth3DModels from "../../components/auth/Auth3DModels";

export const Route = createFileRoute("/auth/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-5 h-full">
      <div className="col-span-2 text-black bg-white">
        <Outlet />
      </div>
      <div className="col-span-3 bg-black">
        <Auth3DModels />
      </div>
    </div>
  );
}
