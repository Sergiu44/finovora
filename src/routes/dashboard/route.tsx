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
} from "@heroicons/react/20/solid";
import moment from "moment";
import { useEffect, useState } from "react";
import { AnimateChangeInHeight } from "../../utils/hoc/AnimateChangeInHeight";
import axios from "axios";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/sessions`, {
        headers: {
          Cookie:
            "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOjIsInVzZXJJZCI6MSwiaWF0IjoxNzUwMjU0MTEzLCJleHAiOjE3NTAyNTUwMTMsImF1ZCI6WyJ1c2VyIl19.YiJsFntRmloBOz8rcVkO2fuPN8vL2P3wjHwAV25LIEk; Path=/; Expires=Wed, 18 Jun 2025 13:56:53 GMT; HttpOnly; SameSite=Strict",
        },
      })
      .then(({ data }) => {
        console.log(data);
      });
  }, []);
  return (
    <div className="dashboard__grid-container">
      <div className="flex flex-col border-r border-[var(--bg-main-light)] p-4">
        <h3>Finovora</h3>

        <div className="flex flex-col mt-12 gap-2">
          <IconLink href="/dashboard" icon={<HomeIcon />} text="Home" />

          <IconLink href="/dashboard/reports" icon={<DocumentIcon />} text="Reports"></IconLink>

          <IconLink href="/dashboard/billing" icon={<CreditCardIcon />} text="Billing" />
        </div>

        {/* Add user session */}
        {true && (
          <div className="mt-auto">
            <AnimateChangeInHeight className="mb-2">
              {menuOpen && (
                <div className="py-2 rounded-md bg-[var(--bg-main-light)] text-[var(--white)] ">
                  <div className="flex px-6 cursor-pointer  py-2 items-center justify-between">
                    <div>My Profile</div>
                    <ArrowLeftStartOnRectangleIcon className="icon icon-sm" />
                  </div>
                  <div className="flex px-6 cursor-pointer  py-2 items-center justify-between">
                    <div>Settings</div>
                    <ArrowLeftStartOnRectangleIcon className="icon icon-sm" />
                  </div>

                  <div className="h-[1px] bg-[var(--bg-main)] w-full my-2" />
                  <div className="flex px-6 cursor-pointer  py-2 items-center justify-between">
                    <div>Logout</div>
                    <ArrowLeftStartOnRectangleIcon className="icon icon-sm" />
                  </div>
                </div>
              )}
            </AnimateChangeInHeight>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:bg-[var(--bg-main-light)] cursor-pointer px-4 py-2 rounded-md  flex items-center justify-between"
            >
              <p className="text-sm">stanciusergiu988@gmail.com</p>
              <ChevronUpDownIcon className="icon" />
            </div>
          </div>
        )}
      </div>
      <div className="grow-1">
        <div className="bg-[var(--bg-main-light)] px-6 py-5">
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
