import { createFileRoute, Outlet } from "@tanstack/react-router";
import "./dashboard.css";
import IconLink from "../../components/IconLink";
import {
  ArrowLeftStartOnRectangleIcon,
  BellAlertIcon,
  ChevronUpDownIcon,
  CreditCardIcon,
  DocumentIcon,
  HomeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/20/solid";
import moment from "moment";
import { useEffect, useState } from "react";
import { AnimateChangeInHeight } from "../../utils/hoc/AnimateChangeInHeight";
import { createEnhancedAxios } from "../../configs/axios";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    createEnhancedAxios()
      .get(`${import.meta.env.VITE_API_URL}/sessions`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        console.log(data);
      });
  }, []);

  const handleLogout = async () => {
    createEnhancedAxios()
      .get(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        withCredentials: true,
      })
      .then(() => {
        localStorage.removeItem("user");
      });
  };
  return (
    <div className="dashboard__grid-container">
      <div className="flex flex-col border-r border-[var(--color-bg-main-light)] p-4">
        <h3>Finovora</h3>

        <div className="flex flex-col mt-12 gap-2">
          <IconLink href="/dashboard" icon={<HomeIcon />} text="Home" />

          <IconLink href="/dashboard/reports" icon={<DocumentIcon />} text="Reports"></IconLink>

          <IconLink href="/dashboard/billing" icon={<CreditCardIcon />} text="Billing" />

          <IconLink href="/dashboard/settings" icon={<Cog6ToothIcon />} text="Settings" />
        </div>

        {/* Add user session */}
        {true && (
          <div className="mt-auto">
            <AnimateChangeInHeight className="mb-2">
              {menuOpen && (
                <div className="py-2 rounded-md bg-[var(--color-bg-main-light)] text-[var(--color-white)] ">
                  <div className="flex px-6 cursor-pointer  py-2 items-center justify-between">
                    <div>My Profile</div>
                    <ArrowLeftStartOnRectangleIcon className="icon icon-sm" />
                  </div>
                  <div className="flex px-6 cursor-pointer  py-2 items-center justify-between">
                    <div>Settings</div>
                    <ArrowLeftStartOnRectangleIcon className="icon icon-sm" />
                  </div>

                  <div className="h-[1px] bg-[var(--color-bg-main)] w-full my-2" />
                  <div className="flex px-6 cursor-pointer  py-2 items-center justify-between">
                    <div onClick={async () => handleLogout()}>Logout</div>
                    <ArrowLeftStartOnRectangleIcon className="icon icon-sm" />
                  </div>
                </div>
              )}
            </AnimateChangeInHeight>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:bg-[var(--color-bg-main-light)] cursor-pointer px-4 py-2 rounded-md  flex items-center justify-between"
            >
              <p className="text-sm">stanciusergiu988@gmail.com</p>
              <ChevronUpDownIcon className="icon" />
            </div>
          </div>
        )}
      </div>
      <div className="grow-1">
        <div className="bg-[var(--color-bg-main-light)] px-6 py-5">
          <div className="flex justify-between">
            <span className="font-bold">{moment().format("DD MMM YYYY")}</span>

            <div className="flex items-center gap-2">
              <BellAlertIcon className="icon icon-active" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="mt-20 px-20">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
