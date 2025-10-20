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

export const Route = createFileRoute(
  "/dashboard/settings/recursive-transactions/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { theme } = useTheme();
  const { data, status } = useQuery({
    queryKey: ["recursive-transactions"],
    queryFn: getRecursiveTransactionsAsync,
  });
  return (
    <BaseWrapper>
      <div className="flex justify-between gap-4">
        <Input placeholder="Search..." />
        <Drawer direction="right">
          <DrawerTrigger>
            <Button>Add Recursive Transaction</Button>
          </DrawerTrigger>
          <DrawerContent
            className={`
              ${theme === "dark" ? "bg-sidebar-primary text-white" : "bg-sidebar"} min-w-2/5
            `}
          >
            <form className="w-full flex flex-col p-6 h-full">
              <DrawerHeader className="px-0">
                <DrawerTitle
                  className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
                >
                  Test
                </DrawerTitle>
              </DrawerHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 col-span-2">
                  <Label>Description</Label>
                  <CustomInput name="description" placeholder="Description" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Amount</Label>
                  <CustomInput name="amount" placeholder="Amount" />
                </div>

                <div className="flex flex-col">
                  <Label>Currency</Label>
                  <CachedSelect
                    name="currency"
                    placeholder="Currency"
                    entityName="currencies"
                    onChange={() => {}}
                  />
                </div>

                <div className="flex flex-col">
                  <Label>Account</Label>
                  <CachedSelect
                    name="currency"
                    placeholder="Currency"
                    entityName="accounts"
                    onChange={() => {}}
                  />
                </div>

                <div className="flex flex-col">
                  <Label className="mb-2">Day in month</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Day in month" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {Array.from({ length: 31 }, (_, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" variant="accent" className="w-full mt-auto">
                Create
              </Button>
            </form>
          </DrawerContent>
        </Drawer>
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
    </BaseWrapper>
  );
}
