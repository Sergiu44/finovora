import { createFileRoute, Outlet } from "@tanstack/react-router";
import Auth3DModels from "../../components/auth/Auth3DModels";

export const Route = createFileRoute("/auth/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-cols-5 h-full">
      <div className="bg-white col-span-2 text-black">
        <Outlet />
      </div>
      <div className="col-span-3">
        <Auth3DModels />
      </div>
    </div>
  );
}
