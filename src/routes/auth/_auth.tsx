import { createFileRoute, Outlet } from "@tanstack/react-router";
import Logo from "../../components/reusable/utils/Logo";

export const Route = createFileRoute("/auth/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid grid-rows-[100px_1fr] h-full">
      {/* <Auth3DModels /> */}
      <div className="flex justify-between items-center my-auto w-5/7 mx-auto h-[100px]">
        <Logo />
        {/* <h1 className="text-2xl font-bold">Finovora</h1> */}
      </div>

      <div className="relative grid place-content-center text-black">
        <Outlet />
      </div>
    </div>
  );
}
