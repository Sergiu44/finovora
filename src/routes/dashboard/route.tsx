import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import "./dashboard.css";
import IconLink from "../../components/reusable/IconLink";
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
import { getAccountsForSwitch } from "../../utils/actions/accounts/userAccounts";
import { useUserMainAccount } from "../../context/UserMainAccount";
import { PlusIcon, TypeIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import AddTransactionForCurrentAccount from "./-components/AddTransactionForCurrentAccount";
import { useUserDetails } from "../../context/UserDetails";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
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
    <div className="dashboard__grid-container">
      <div className="flex flex-col p-4 max-h-screen sticky top-0 bg-white border-r-2 border-sidebar-border">
        <h3>Finovora</h3>

        <div className="flex flex-col mt-12 gap-2">
          <IconLink href="/dashboard" icon={<HomeIcon />} text="Home" />

          <IconLink
            href="/dashboard/reports"
            icon={<DocumentIcon />}
            text="Reports"
          ></IconLink>

          <IconLink
            href="/dashboard/billing"
            icon={<CreditCardIcon />}
            text="Billing"
          />

          <IconLink
            href="/dashboard/categories"
            icon={<TypeIcon />}
            text="Categories"
          />

          <IconLink
            href="/dashboard/settings/profile"
            icon={<Cog6ToothIcon />}
            text="Settings"
          />
        </div>

        {/* Add user session */}
        {status !== "pending" ? (
          <div className="mt-auto">
            <AnimateChangeInHeight className="mb-2">
              {walletOpen && (
                <div className="py-3 rounded-md bg-muted text-muted-foreground!">
                  {data && data.length > 0 ? (
                    data?.map((account) => (
                      <div
                        onClick={() => {
                          setWalletOpen(false);
                          setUserMainAccountId(account.id);
                        }}
                        className="mx-2 px-4 rounded-3xl py-3 flex justify-between items-start cursor-pointer hover:bg-white"
                        key={account.id}
                      >
                        <div className="text-black text-sm">{account.name}</div>
                        <div className="text-black font-bold">
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
            {!walletOpen && (
              <Button
                onClick={() => setAddTransactionModalOpen(true)}
                className="flex items-center rounded-3xl w-full"
                variant="default"
              >
                <PlusIcon />
                <span className="font-bold text-[16px]">Add transaction</span>
              </Button>
            )}
            <div
              onClick={() => setWalletOpen(!walletOpen)}
              className="hover:bg-muted cursor-pointer px-4 py-2 mt-1 rounded-md  flex items-center justify-between"
            >
              <p className="text-sm text-light-gray">
                {account && account.name}
              </p>
              <div className="flex items-center gap-1">
                <span className="font-bold">{account && account.balance} </span>
                <span className="font-bold">
                  {account && account.currency.symbol}
                </span>
                <ChevronUpDownIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-auto rounded-xl h-[40px] w-full animate-pulse bg-main"></div>
        )}
      </div>

      <div className="grow-1 bg-sidebar">
        <div className="bg-white border-b border-sidebar-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="font-bold">{moment().format("DD MMM YYYY")}</span>

            <div className="flex items-start relative gap-2">
              <BellAlertIcon className="icon icon-active" />

              {true && (
                <div className="mt-auto relative">
                  <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="hover:bg-bg-main-light cursor-pointer px-4 py-2 rounded-md  flex items-center justify-between"
                  >
                    <p className="text-sm">{user?.email}</p>
                    <ChevronUpDownIcon className="icon" />
                  </div>

                  <AnimateChangeInHeight className="mb-2 absolute inset-x-0">
                    {menuOpen && (
                      <div className="py-2 rounded-md bg-muted">
                        <div className="flex px-4 hover:bg-white hover:text-black text-muted-foreground mx-2 rounded-md cursor-pointer py-2 items-center justify-between">
                          <div>My Profile</div>
                          <ArrowLeftStartOnRectangleIcon className="h-5" />
                        </div>
                        <div className="flex px-4 hover:bg-white hover:text-black text-muted-foreground mx-2 rounded-md cursor-pointer py-2 items-center justify-between">
                          <div>Settings</div>
                          <ArrowLeftStartOnRectangleIcon className="h-5" />
                        </div>

                        <div className="h-[1px] bg-border w-full my-2" />
                        <div className="flex px-4 hover:bg-white hover:text-black text-muted-foreground mx-2 rounded-md cursor-pointer  py-2 items-center justify-between">
                          <div onClick={async () => handleLogout()}>Logout</div>
                          <ArrowLeftStartOnRectangleIcon className="h-5" />
                        </div>
                      </div>
                    )}
                  </AnimateChangeInHeight>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-20 py-10">
          <Outlet />
        </div>
      </div>

      <AddTransactionForCurrentAccount
        open={addTransactionModalOpen}
        setOpen={setAddTransactionModalOpen}
      />
    </div>
  );
}
