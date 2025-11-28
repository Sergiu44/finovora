import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import "../../styles/dashboard.css";
import IconLink from "../../components/reusable/IconLink";
import moment from "moment";
import { useState } from "react";
import { AnimateChangeInHeight } from "../../utils/hoc/AnimateChangeInHeight";
import { createEnhancedAxios } from "../../configs/axios";
import { useQuery } from "@tanstack/react-query";
import { getAccountsForSwitch } from "../../utils/actions/accounts/userAccounts";
import { useUserMainAccount } from "../../context/UserMainAccount";
import {
  Bell,
  ChevronsUpDownIcon,
  CogIcon,
  LucideHome,
  PlusIcon,
  SidebarClose,
  SidebarOpen,
  TypeIcon,
  Wallet2Icon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import AddTransactionForCurrentAccount from "./-index-components/AddTransactionForCurrentAccount";
import { useUserDetails } from "../../context/UserDetails";
import SwitchTheme from "../../components/reusable/switch/SwitchTheme";
import SwitchApp from "./-index-components/SwitchApp";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const { account, setUserMainAccountId } = useUserMainAccount();
  const { user } = useUserDetails();
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
    <div
      className={`dashboard__grid-container ${!sidebarOpen && "dashboard__grid-container--sidebar-close"}`}
    >
      <div
        id="dashboard__grid-container-sidebar"
        className="overflow-hidden flex flex-col max-h-screen sticky top-0 bg-white border-r rounded-none border-sidebar-border"
      >
        <div className="border-b border-border grid items-center py-4 px-4">

        <h3 className="dark:text-white text-2xl font-semibold">
          {sidebarOpen ? "Finovora" : "F"}
        </h3>

        <SwitchApp />
        </div>


        <div
          id="dashboard__grid-container-sidebar-content-wrapper"
          className="flex flex-col gap-2 m-4"
        >
          <IconLink
            href="/dashboard"
            icon={<LucideHome className="h-4 w-4" />}
            text="Home"
            size="sm"
          />

          {/* <IconLink
            href="/dashboard/reports"
            icon={<DocumentIcon className="h-4 w-4" />}
            text="Reports"
            size="sm"
          /> */}

          {/* <IconLink
            size="sm"
            href="/dashboard/billing"
            icon={<CreditCardIcon className="h-4 w-4" />}
            text="Billing"
          /> */}

          <IconLink
            size="sm"
            href="/dashboard/categories"
            icon={<TypeIcon className="h-4 w-4" />}
            text="Categories"
          />

          <IconLink
            size="sm"
            href="/dashboard/budget-planner"
            icon={<Wallet2Icon className="h-4 w-4" />}
            text="Budget Planner"
          />

          <IconLink
            size="sm"
            href="/dashboard/settings/profile"
            icon={<CogIcon className="h-4 w-4" />}
            text="Settings"
          />
        </div>

        {/* Add user session */}
        {status !== "pending" ? (
          <div className="mt-auto px-4 mb-2 py-2 border-t border-border">
            <AnimateChangeInHeight className="mb-2">
              {walletOpen && (
                <div className="rounded-base border py-2 border-border bg-white text-muted-foreground! flex flex-col gap-1.5">
                  {data && data.length > 0 ? (
                    data?.map((account) => (
                      <div
                        onClick={() => {
                          setWalletOpen(false);
                          setUserMainAccountId(account.id);
                        }}
                        className="mx-1 px-3 py-1 rounded-[8px] flex justify-between items-center cursor-pointer hover:bg-muted-foreground/20"
                        key={account.id}
                      >
                        <div className="text-black text-sm">{account.name}</div>
                        <div className="text-black font-bold text-xs">
                          {account.balance} {account.currency.symbol}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-3 text-sm text-center text-gray-500">
                      No accounts found
                    </div>
                  )}
                </div>
              )}
            </AnimateChangeInHeight>

            <div
              onClick={() => setWalletOpen(!walletOpen)}
              className="hover:bg-muted-foreground/20 cursor-pointer px-3 py-2 rounded-base flex flex-col gap-1"
            >
              <div className="flex items-center justify-between gap-1">

              <p className="text-sm text-light-gray">
                {account && account.name}
              </p>
              <SwitchTheme />
              </div>
              <div className="flex gap-1 text-sm">
                <div>
                <span className="font-semibold">
                  {account && account.balance}
                </span>
                <span className="font-semibold">
                  {account && account.currency.symbol}
                </span>
                </div>
                <ChevronsUpDownIcon className="h-4 w-4" />
              </div>
            </div>
            <Button
              onClick={() => setAddTransactionModalOpen(true)}
              className="flex items-center rounded-sm w-full cursor-pointer mt-2"
              variant="default"
              size="sm"
            >
              <PlusIcon className="size-3.5" />
              Add transaction
            </Button>
          </div>
        ) : (
          <div className="mt-auto rounded-xl h-[40px] w-full animate-pulse bg-main"></div>
        )}
      </div>

      <div className="grow-1 bg-gray-50/50">
        <div className="h-[65px] bg-white border-b border-sidebar-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex relative h-[37.27px] items-center gap-3">
              <span
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-primary hover:text-white transition-colors rounded-full cursor-pointer p-2"
              >
                {sidebarOpen ? (
                  <SidebarClose className="h-3.5 w-3.5" />
                ) : (
                  <SidebarOpen className="h-3.5 w-3.5" />
                )}
              </span>
              <span className="font-bold">
                {moment().format("DD MMM YYYY")}
              </span>
            </div>

            <div className="flex relative gap-2 items-center">
              <Bell className="h-4 w-4" />

              {user && (
                <>
                  <div className="mt-auto relative">
                    <div
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="hover:bg-bg-main-light cursor-pointer px-4 py-2 rounded-base  flex items-center justify-between"
                    >
                      <p className="text-sm">{user?.email}</p>
                      <ChevronsUpDownIcon className="w-4 h-4" />
                    </div>

                    <AnimateChangeInHeight className="z-10 mb-2 absolute inset-x-0">
                      {menuOpen && (
                        <div className="py-2 rounded-base bg-muted">
                          <div className="flex px-4 hover:bg-white hover:text-black text-muted-foreground mx-2 rounded-base cursor-pointer py-2 items-center justify-between">
                            <div>My Profile</div>
                          </div>
                          <div className="flex px-4 hover:bg-white hover:text-black text-muted-foreground mx-2 rounded-base cursor-pointer py-2 items-center justify-between">
                            <div>Settings</div>
                          </div>

                          <div className="h-[1px] bg-border w-full my-2" />
                          <div className="flex px-4 hover:bg-white hover:text-black text-muted-foreground mx-2 rounded-base cursor-pointer  py-2 items-center justify-between">
                            <div onClick={async () => handleLogout()}>
                              Logout
                            </div>
                          </div>
                        </div>
                      )}
                    </AnimateChangeInHeight>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <Outlet />
      </div>

      <AddTransactionForCurrentAccount
        open={addTransactionModalOpen}
        setOpen={setAddTransactionModalOpen}
      />
    </div>
  );
}
