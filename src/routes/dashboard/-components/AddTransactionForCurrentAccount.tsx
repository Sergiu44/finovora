import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import CachedSelect from "../../../components/reusable/selects/CachedSelect";
import { useUserMainAccount } from "../../../context/UserMainAccount";
import { useValidation } from "../../../utils/hooks/useValidation/useValidation";
import Validator from "../../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../../utils/hooks/useValidation/index";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../../../components/ui/input";
import { getEnumValues } from "../../../utils/arrays";
import CustomInput from "../../../components/reusable/inputs/CustomInput";
import { TransactionTypes, CategoryType } from "../../../types/enums/TransactionTypes";
import { createTransactionAsync } from "../../../utils/actions/transactions";

interface IAddTransactionForCurrentAccount {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddTransactionForCurrentAccount(props: IAddTransactionForCurrentAccount) {
  const { account } = useUserMainAccount();
  const [transactionType, setTransactionType] = useState<TransactionTypes>(TransactionTypes.Expense);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Form validation
  const { values, errors, onChangeInput, onChangeValue, handleCheckFormErrors } = useValidation(
    new Validator()
      .forProperty("amount")
      .check(VALIDATIONS.isRequired, "Amount is required.")
      .check((value: string) => !isNaN(Number(value)) && Number(value) > 0, "Amount must be a positive number.")
      .forProperty("description")
      .check(VALIDATIONS.isRequired, "Description is required.")
      .check(VALIDATIONS.minLength(3), "Description must be at least 3 characters.")
      .forProperty("categoryId")
      .check(VALIDATIONS.isRequired, "Category is required.")
      .forProperty("date")
      .check(VALIDATIONS.isRequired, "Date is required.")
      .forProperty("accountId")
      .check(VALIDATIONS.isRequired, "Account is required.")
      .forProperty("currencyId")
      .check(VALIDATIONS.isRequired, "Currency is required.")
      .applyCheckOnlyOnSubmit()
  );

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
      categoryId: Number(formData.get("categoryId")),
      transactionDate: new Date(formData.get("date") as string),
      userId: 1,
      currencyId: Number(formData.get("currencyId")),
    };

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
      <DialogContent className="max-w-[calc(100vw-20px)]! h-[calc(100%-20px)] p-12 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3%_max(500px,67.5%)]">
            {/* Left Column - Header and Transaction Type */}
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <DialogTitle className="text-2xl font-bold">Add Transaction</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Add a new transaction to {account?.name || "your account"}
                </DialogDescription>
              </div>

              {/* Transaction Type Selection */}
              <RadioGroup
                value={transactionType.toString()}
                onValueChange={(value) => {
                  console.log(Number(value) as TransactionTypes);
                  setTransactionType(Number(value) as TransactionTypes);
                  setSelectedCategory("");
                }}
                className="flex gap-0 relative"
              >
                {getEnumValues(CategoryType).map((key) => (
                  <div className="relative flex items-center gap-2" key={"add-transaction-for-current-account-" + key}>
                    <RadioGroupItem
                      value={CategoryType[key as keyof typeof CategoryType].toString()}
                      id={"add-transaction-for-current-account-" + key}
                    />
                    <Label className="p-4" htmlFor={"add-transaction-for-current-account-" + key}>
                      {key}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div></div>

            {/* Right Column - All Form Fields */}
            <div className="space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount *
                </Label>
                <div className="relative">
                  <CustomInput
                    name="amount"
                    value={values.amount}
                    onChange={onChangeInput}
                    errorMessage={errors.amount}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    leftElementClassName="left-0! max-w-[110px]"
                    leftElement={
                      <CachedSelect
                        className="shadow-none mt-0! text-muted-foreground! max-w-[110px]"
                        entityName="currencies"
                        placeholder="Select a currency"
                        name="currencyId"
                        onChange={function (value: string): void {
                          onChangeValue("currencyId", value);
                        }}
                      />
                    }
                    className="pl-26!"
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={values.description}
                  onChange={onChangeInput}
                  placeholder="What is this transaction for?"
                  className="w-full"
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date *
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={values.date || new Date().toISOString().split("T")[0]}
                  onChange={onChangeInput}
                  className="w-full"
                />
                {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
              </div>

              {/* Account Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Account *</Label>
                <CachedSelect
                  entityName="accounts"
                  placeholder="Select an account"
                  name="accountId"
                  errorMessage={errors.accountId}
                  onChange={(value) => {
                    onChangeValue("accountId", value);
                  }}
                  params={{ transactionTypeId: transactionType?.toString() ?? "" }}
                />
                {errors.accountId && <p className="text-sm text-red-500 mt-1">{errors.accountId}</p>}
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category *</Label>
                <CachedSelect
                  entityName="categories"
                  name="categoryId"
                  errorMessage={errors.categoryId}
                  onChange={(value) => {
                    onChangeValue("categoryId", value);
                    setSelectedCategory(value);
                  }}
                  defaultValue={selectedCategory}
                  params={{ transactionTypeId: transactionType.toString() }}
                />
                {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions - Full Width */}
          <div className="flex gap-3 justify-end pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={() => props.setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]">
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
