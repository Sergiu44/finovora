import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "../../components/ui/card";
import SelectedCardDetails from "./-components/Home/SelectedCardDetails";
import { Button } from "../../components/ui/button";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import SelectedCardTransactions from "./-components/Home/SelectedCardTransactions";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Easy way to manage your finances</p>
      <div className="grid grid-cols-[300px_1fr] gap-4 mt-4">
        <div>
          <div className="rounded-[4px] mb-4 shadow-lg bg-primary h-[150px]"></div>

          <Card className="border-0 shadow-none! border-b! border-border">
            <CardContent>
              <h3 className="font-bold mb-2 block">Account information</h3>
              <p className="text-xs">Lorem ipsum dolor sit amet con</p>

              <div className="mt-4 grid grid-cols-[1fr_1fr]">
                <span className="text-sm font-bold text-muted-foreground">Account name</span>
                <span className="text-sm text-muted-foreground">test</span>

                <span className="text-sm font-bold text-muted-foreground">Account type</span>
                <span className="text-sm text-muted-foreground">Cash</span>

                <span className="text-sm font-bold text-muted-foreground">Currency</span>
                <span className="text-sm text-muted-foreground">RON</span>

                <span className="text-sm font-bold text-muted-foreground">Created at</span>
                <span className="text-sm text-muted-foreground">2025-01-01</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0! shadow-none! border-b! border-border">
            <CardContent>
              <h3 className="font-bold mb-2 block">Billing details</h3>
              <p className="text-xs">The percentages are relative to last month</p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col items-center">
                  <div className="flex gap-2">
                    <h3 className="text-xl font-bold text-green-500">120.04</h3>
                    <span className="grid items-center h-full rounded-md px-1.5 text-xs text-green-800 bg-green-300">
                      +12%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">Income</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex gap-2">
                    <h3 className="text-xl font-bold text-error-600">200.21</h3>
                    <span className="grid items-center h-full rounded-md px-1.5 text-xs text-error-300 bg-error-700">
                      -12%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">Expenses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0! shadow-none!">
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 flex items-start gap-0.5">
                <InformationCircleIcon className="w-3 h-3 text-primary" /> test
              </p>
              <Button variant="destructive" className="rounded-xs w-full mt-2" size="xs">
                Delete account
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <SelectedCardDetails card={{ name: "test" }} />

          <SelectedCardTransactions card={{ name: "test", id: 1 }} />
        </div>
      </div>
    </>
  );
}
