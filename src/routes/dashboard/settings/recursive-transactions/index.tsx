import { createFileRoute } from "@tanstack/react-router";
import BaseWrapper from "../../../../components/reusable/layouts/BaseWrapper";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getRecursiveTransactionsAsync } from "../../../../utils/actions/transactions/recursiveTransactions";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../../components/ui/drawer";
import { useTheme } from "../../../../context/ThemeProvider";
import { Label } from "../../../../components/ui/label";
import CustomInput from "../../../../components/reusable/inputs/CustomInput";
import CachedSelect from "../../../../components/reusable/selects/CachedSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Card, CardContent } from "../../../../components/ui/card";
import { ArrowDownLeft, ArrowsUpFromLine, ArrowUpCircle, ArrowUpRight, RefreshCw, SearchIcon } from "lucide-react";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/20/solid";

export const Route = createFileRoute(
  "/dashboard/settings/recursive-transactions/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { status, data } = useQuery({
    queryKey: ["recursive-transactions"],
    queryFn: getRecursiveTransactionsAsync,
  });

  return (
    <BaseWrapper>
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Recursive Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Manage your scheduled income and expenses
        </p>
      </div>

      {status === "pending" && (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      )}

      {status === "error" && (
        <div className="flex justify-center items-center h-full">
          <div className="text-red-500">
            Error loading recursive transactions
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex justify-center items-center h-full">
          <div className="text-green-500">Recursive transactions loaded</div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="bg-green-100 p-2 rounded-[8px]">
                <ArrowDownLeft className="text-green-500" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm text-muted-foreground tracking-wider">Monthly Income</h3>
                <p className="text-xl text-green-500 font-bold tracking-wider">1000.00 RON</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="bg-red-100 p-2 rounded-[8px]">
                <ArrowUpRight className="text-red-500" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm text-muted-foreground tracking-wider">Monthly Expenses</h3>
                <p className="text-xl text-red-500 font-bold tracking-wider">1000.00 RON</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="bg-violet-100 p-2 rounded-[8px]">
                <RefreshCw className="text-violet-500" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm text-muted-foreground tracking-wider">Net Monthly</h3>
                <p className="text-xl text-violet-500 font-bold tracking-wider">1000.00 RON</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CustomInput wrapperClassName="my-4" name="transactions-search" placeholder="Search transactions..." leftElement={<SearchIcon className="text-muted-foreground" size={20} />} className="pl-10!" />

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((transaction) => (
            <Card key={transaction.id}>
              <CardContent>
                <h3>{transaction.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">No recursive transactions found</p>
        </div>
      )}

    </BaseWrapper>
  );
}
