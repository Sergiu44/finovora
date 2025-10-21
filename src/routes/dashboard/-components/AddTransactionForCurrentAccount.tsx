import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import CachedSelect from "../../../components/reusable/selects/CachedSelect";
import { useUserMainAccount } from "../../../context/UserMainAccount";
import { useValidation } from "../../../utils/hooks/useValidation/useValidation";
import Validator from "../../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../../utils/hooks/useValidation/index";
import { useMutation } from "@tanstack/react-query";
import { getEnumValues } from "../../../utils/arrays";
import CustomInput from "../../../components/reusable/inputs/CustomInput";
import {
  TransactionTypes,
  CategoryType,
} from "../../../types/enums/TransactionTypes";
import { createTransactionAsync } from "../../../utils/actions/transactions";

interface IAddTransactionForCurrentAccount {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddTransactionForCurrentAccount(
  props: IAddTransactionForCurrentAccount
) {
  const { account } = useUserMainAccount();
  const [transactionType, setTransactionType] = useState<TransactionTypes>(
    TransactionTypes.Income
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Form validation
  const {
    values,
    errors,
    setValues,
    onChangeInput,
    onChangeValue,
    handleCheckFormErrors,
  } = useValidation(
    new Validator()
      .forProperty("amount")
      .check(VALIDATIONS.isRequired, "Amount is required.")
      .check(
        (value: string) => !isNaN(Number(value)) && Number(value) > 0,
        "Amount must be a positive number."
      )
      .forProperty("description")
      .check(VALIDATIONS.isRequired, "Description is required.")
      .check(
        VALIDATIONS.minLength(3),
        "Description must be at least 3 characters."
      )
      .forProperty("categoryId")
      .check(
        VALIDATIONS.isRequired,
        "Category is required.",
        transactionType === TransactionTypes.Transfer
      )
      .forProperty("date")
      .check(VALIDATIONS.isRequired, "Date is required.")
      .forProperty("accountId", account?.id.toString())
      .check(VALIDATIONS.isRequired, "Account is required.")
      .forProperty("currencyId")
      .check(VALIDATIONS.isRequired, "Currency is required.")
      .applyCheckOnlyOnSubmit()
      .forProperty("destinationAccountId")
      .check(
        (val: string) => val !== values.accountId,
        "Destination account must be different from the source account.",
        transactionType !== TransactionTypes.Transfer
      )
      .check(
        VALIDATIONS.isRequired,
        "Destination account is required.",
        transactionType !== TransactionTypes.Transfer
      )
  );

  useEffect(() => {
    if (account) {
      setValues({
        ...values,
        accountId: account.id.toString(),
      });
    }
  }, [account]);

  const { mutate: createTransaction } = useMutation({
    mutationKey: ["createTransaction"],
    mutationFn: createTransactionAsync,
  });

  // Handle form submission
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (handleCheckFormErrors()) {
      return;
    }

    const formData = new FormData(ev.currentTarget);
    const transactionData = {
      accountId: Number(formData.get("accountId")),
      transactionTypeId: transactionType,
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
      transactionDate: new Date(formData.get("date") as string),
      userId: 1,
      currencyId: Number(formData.get("currencyId")),
    } as any;

    if (transactionType !== TransactionTypes.Transfer) {
      transactionData.categoryId = Number(formData.get("categoryId"));
    } else {
      transactionData.destinationAccountId = Number(
        formData.get("destinationAccountId")
      );
    }

    createTransaction(transactionData, {
      onSuccess: () => {
        props.setOpen(false);
      },
      onError: (error) => {
        console.error("Error creating transaction", error);
      },
    });
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (props.open) {
      setTransactionType(TransactionTypes.Expense);
      setSelectedCategory("");
    }
  }, [props.open]);

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="max-w-[900px] sm:max-w-[800px] p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold">
              Add Transaction
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Add a new transaction to {account?.name || "your account"}
            </DialogDescription>
          </div>

          {/* Transaction Type - Top Row */}
          <div className="grid grid-cols-[35%_auto] mb-2">
            <div></div>

            {/* Grid Layout for Form Fields */}
            <div className="">
              <Tabs
                value={transactionType.toString()}
                onValueChange={(value) => {
                  setTransactionType(Number(value) as TransactionTypes);
                  setSelectedCategory("");
                }}
                className="w-full border-0!"
              >
                <TabsList
                  variant="default"
                  className="grid w-full grid-cols-3 rounded-[10px]!"
                >
                  {getEnumValues(CategoryType).map((key) => (
                    <TabsTrigger
                      key={"add-transaction-for-current-account-" + key}
                      value={CategoryType[
                        key as keyof typeof CategoryType
                      ].toString()}
                      className="rounded-[10px]!"
                    >
                      {key}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              {/* Amount - 3 columns */}
              <div className="mb-3 mt-4">
                <Label
                  htmlFor="amount"
                  className="text-sm font-medium block mb-1 ml-1"
                >
                  Amount *
                </Label>
                <div className="relative">
                  <CustomInput
                    name="amount"
                    value={values.amount}
                    onChange={onChangeInput}
                    errorMessage={errors.amount || errors.currencyId}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    leftElementClassName="left-0! max-w-[110px]"
                    leftElement={
                      <CachedSelect
                        className={`shadow-none mt-0! border-0! border-transparent! h-[25px]! ml-1! text-muted-foreground! max-w-[110px] ${errors.currencyId && "border-error! focus-visible:ring-error-600! focus-visible:border-error!"}`}
                        entityName="currencies"
                        placeholder="Currency"
                        name="currencyId"
                        onChange={(value) => onChangeValue("currencyId", value)}
                      />
                    }
                    className="pl-26! "
                  />
                </div>
              </div>

              {/* Date - 1 column */}
              <div className="mb-3">
                <Label
                  htmlFor="date"
                  className="text-sm font-medium block mb-1 ml-1"
                >
                  Date *
                </Label>
                <CustomInput
                  errorMessage={errors.date}
                  id="date"
                  name="date"
                  type="date"
                  onChange={onChangeInput}
                  className="w-full  text-[14px]! place-content-center! block!"
                />
              </div>

              {/* Description - 3 columns */}
              <div className="mb-3">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium block mb-1 ml-1"
                >
                  Description *
                </Label>
                <CustomInput
                  errorMessage={errors.description}
                  id="description"
                  name="description"
                  onChange={onChangeInput}
                  placeholder="What is this transaction for?"
                  className="w-full "
                />
              </div>

              {/* Category - 2 columns */}
              {transactionType !== TransactionTypes.Transfer && (
                <div className="mb-3">
                  <Label
                    htmlFor="categoryId"
                    className="text-sm font-medium block mb-1 ml-1"
                  >
                    Category *
                  </Label>
                  <CachedSelect
                    entityName="categories"
                    placeholder="Select a category"
                    name="categoryId"
                    errorMessage={errors.categoryId}
                    onChange={(value) => {
                      onChangeValue("categoryId", value);
                      setSelectedCategory(value);
                    }}
                    defaultValue={selectedCategory}
                    params={{ transactionTypeId: transactionType.toString() }}
                  />
                </div>
              )}

              {/* Account Selection - 2 columns */}
              <div className="mb-3">
                <Label
                  htmlFor="accountId"
                  className="text-sm font-medium block mb-1 ml-1"
                >
                  Account *
                </Label>
                <CachedSelect
                  className=""
                  defaultValue={account?.id.toString()}
                  entityName="accounts"
                  placeholder="Select an account"
                  name="accountId"
                  errorMessage={errors.accountId}
                  onChange={(value) => onChangeValue("accountId", value)}
                  params={{
                    transactionTypeId: transactionType?.toString() ?? "",
                  }}
                />
              </div>

              {/* Destination Account for Transfers - 2 columns */}
              {transactionType === TransactionTypes.Transfer && (
                <div className="mb-3">
                  <Label className="text-sm font-medium block mb-1 ml-1">
                    Destination Account *
                  </Label>
                  <CachedSelect
                    omitIds={account ? [account.id.toString()] : []}
                    entityName="accounts"
                    placeholder="Select a transfer account"
                    name="destinationAccountId"
                    errorMessage={errors.destinationAccountId}
                    onChange={(value) =>
                      onChangeValue("destinationAccountId", value)
                    }
                    params={{
                      transactionTypeId: transactionType?.toString() ?? "",
                    }}
                    className=""
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => props.setOpen(false)}
            >
              Discard changes
            </Button>
            <Button type="submit" className="min-w-[100px]">
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
