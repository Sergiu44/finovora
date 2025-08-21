import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
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
import { useState } from "react";
import { AnimateChangeInHeight } from "../../utils/hoc/AnimateChangeInHeight";
import { createEnhancedAxios } from "../../configs/axios";
import { useQuery } from "@tanstack/react-query";
import { getAccountsForSwitch } from "../../actions/accounts/userAccounts";
import { useUserMainAccount } from "../../context/UserMainAccount";
import { Card } from "../../components/ui/card";
import { PlusIcon, TypeIcon } from "lucide-react";
import { Button } from "../../components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const { account, setUserMainAccountId } = useUserMainAccount();
  const router = useRouter();

  const { data, status } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccountsForSwitch,
  });

  const handleLogout = async () => {
    createEnhancedAxios()
      .get(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        withCredentials: true,
      })
      .then(() => {
        localStorage.removeItem("user");
        router.navigate({ to: "/auth/login" });
      });
  };
  return (
    <div className="dashboard__grid-container">
      <Card className="flex flex-col border-r border-bg-main-light p-4 max-h-screen sticky top-0">
        <h3>Finovora</h3>

        <div className="flex flex-col mt-12 gap-2">
          <IconLink href="/dashboard" icon={<HomeIcon />} text="Home" />

          <IconLink href="/dashboard/reports" icon={<DocumentIcon />} text="Reports"></IconLink>

          <IconLink href="/dashboard/billing" icon={<CreditCardIcon />} text="Billing" />

          <IconLink href="/dashboard/categories" icon={<TypeIcon />} text="Categories" />

          <IconLink href="/dashboard/settings/profile" icon={<Cog6ToothIcon />} text="Settings" />
        </div>

        {/* Add user session */}
        {status !== "pending" ? (
          <div className="mt-auto">
            <AnimateChangeInHeight className="mb-2">
              {walletOpen && (
                <div className="py-3 rounded-md bg-[var(--color-bg-main-light)] text-[var(--color-white)] ">
                  {data && data.length > 0 ? (
                    data?.map((account) => (
                      <div
                        onClick={() => {
                          setWalletOpen(false);
                          setUserMainAccountId(account.id);
                        }}
                        className="mx-2 px-4 rounded-md py-3 flex justify-between items-start cursor-pointer hover:bg-bg-main-hover"
                        key={account.id}
                      >
                        <div className="text-gray-500">{account.name}</div>
                        <div className="text-gray-500">
                          {account.balance} {account.currency.symbol}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-3 text-sm text-center text-gray-500">No accounts found</div>
                  )}
                </div>
              )}
            </AnimateChangeInHeight>
            {!walletOpen && (
              <Button className="flex items-center w-[85%] rounded-3xl mx-auto">
                <PlusIcon />
                <span className="font-bold text-[16px]">Add transaction</span>
              </Button>
            )}
            <div
              onClick={() => setWalletOpen(!walletOpen)}
              className="hover:bg-[var(--color-bg-main-light)] cursor-pointer pl-4 pr-2 py-4 rounded-md  flex items-center justify-between"
            >
              <p className="text-sm text-light-gray text-ellipsis overflow-hidden whitespace-nowrap">
                {account && account.name}
              </p>
              <div className="flex items-center gap-1">
                <span className="font-bold">
                  {account && account.balance} {account && account.currency.symbol}
                </span>
                <ChevronUpDownIcon className="icon" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-auto rounded-xl h-[40px] w-full animate-pulse bg-main"></div>
        )}
      </Card>

      <div className="grow-1">
        <div className="bg-[var(--color-bg-main-light)] px-6 py-5">
          <div className="flex items-start justify-between">
            <span className="font-bold">{moment().format("DD MMM YYYY")}</span>

            <div className="flex items-start relative gap-2">
              <BellAlertIcon className="icon icon-active" />

              {true && (
                <div className="mt-auto relative">
                  <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="hover:bg-[var(--color-bg-main-light)] cursor-pointer px-4 py-2 rounded-md  flex items-center justify-between"
                  >
                    <p className="text-sm">stanciusergiu988@gmail.com</p>
                    <ChevronUpDownIcon className="icon" />
                  </div>

                  <AnimateChangeInHeight className="mb-2 absolute inset-x-0">
                    {menuOpen && (
                      <div className="py-2 rounded-md bg-bg-main-light text-white">
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
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto min-h-[80%]">
          <div className="mt-10 px-16">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
