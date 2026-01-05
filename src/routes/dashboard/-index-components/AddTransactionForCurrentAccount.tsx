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
import { useQuery } from "@tanstack/react-query";
import { getEnumValues } from "../../../utils/arrays";
import CustomInput from "../../../components/reusable/inputs/CustomInput";
import {
  TransactionTypes,
  CategoryType,
} from "../../../types/enums/TransactionTypes";
import {
  createTransactionAsync,
  editTransactionAsync,
  getTransactionAsync,
  getUserCurrencyRateByCurrencyId,
} from "../../../utils/actions/transactions";
import moment from "moment";
import { ArrowLeftRight, TrendingDown, TrendingUp } from "lucide-react";
import { useUserDetails } from "../../../context/UserDetails";
import useCreateEditMutation from "../../../utils/hooks/useCreateEditMutation/useCreateEditMutation";
import { formatCurrency } from "../../../utils/currencies/formatCurrency";

const TransactionTypeIcons = {
  Income: <TrendingUp className="size-3" />,
  Expense: <TrendingDown className="size-3" />,
  Transfer: <ArrowLeftRight className="size-3" />,
};

interface IAddTransactionForCurrentAccount {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId?: number;
}

export default function AddTransactionForCurrentAccount(
  props: IAddTransactionForCurrentAccount
) {
  const { user } = useUserDetails();
  const { account } = useUserMainAccount();

  const func = useCreateEditMutation({
    id: props.transactionId?.toString(),
    basePath: "transactions",
    createFn: createTransactionAsync,
    editFn: editTransactionAsync,
  });
  const { data: transactionData } = useQuery({
    queryKey: ["transaction", props.transactionId],
    queryFn: () => getTransactionAsync(props.transactionId!),
    enabled: !!props.transactionId,
  });
  const { data: currencyRate } = useQuery({
    queryKey: ["user-currency-rate", account?.currency.id],
    queryFn: () => {
      if (account && account.currency.id) {
        return getUserCurrencyRateByCurrencyId(account.currency.id);
      }
      return null;
    },
    enabled: !!account?.currency.id,
  });
  const [transactionType, setTransactionType] = useState<TransactionTypes>(
    TransactionTypes.Expense
  );
  const [disabledTabs, setDisabledTabs] = useState<boolean>(false);

  // Form validation
  const {
    values,
    errors,
    setValues,
    onChangeInput,
    onChangeValue,
    handleCheckFormErrors,
    setErrors,
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
      .forProperty("date", moment().format("YYYY-MM-DD"))
      .check(VALIDATIONS.isRequired, "Date is required.")
      .forProperty("accountId", account?.id.toString())
      .check(VALIDATIONS.isRequired, "Account is required.")
      .forProperty("currencyId", account?.currency.id.toString())
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

  const resetErrors = () => {
    setErrors({
      amount: "",
      description: "",
      date: "",
      categoryId: "",
      destinationAccountId: "",
      currencyId: "",
      accountId: "",
    });
  };

  const resetFormState = () => {
    setValues((prev) => ({
      ...prev,
      amount: "",
      description: "",
      date: moment().format("YYYY-MM-DD"),
      categoryId: "",
      destinationAccountId: "",
      currencyId: account?.currency.id,
      accountId: account?.id.toString(),
    }));
    resetErrors();
  };

  useEffect(() => {
    if (transactionData) {
      setDisabledTabs(true);
      setTransactionType(
        TransactionTypes[
          transactionData.transactionType.name as keyof typeof TransactionTypes
        ]
      );
      setValues((prev) => ({
        ...prev,
        categoryId: transactionData.category?.id?.toString(),
        destinationAccountId:
          transactionData.destinationAccount?.id?.toString(),
        currencyId: transactionData.currency?.id?.toString(),
        amount: transactionData.amount.toString(),
        description: transactionData.description,
        date: moment(new Date(transactionData.transactionDate)).format(
          "YYYY-MM-DD"
        ),
        accountId: transactionData.account?.id?.toString(),
        transactionTypeId: transactionData.transactionType?.id?.toString(),
      }));
    }
  }, [transactionData, setValues]);

  useEffect(() => {
    if (account) {
      setValues((prev) => ({
        ...prev,
        accountId: account.id.toString(),
      }));
    }
  }, [account, setValues]);

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
      userId: user?.id,
      currencyId: Number(formData.get("currencyId")),
    } as any;

    if (transactionType !== TransactionTypes.Transfer) {
      transactionData.categoryId = Number(formData.get("categoryId"));
    } else {
      transactionData.destinationAccountId = Number(
        formData.get("destinationAccountId")
      );
    }

    func(transactionData, {
      onSuccess: () => {
        props.setOpen(false);
      },
      onError: (error) => {
        console.error("Error creating transaction", error);
      },
    });
  };

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent
        showCloseButton={true}
        className="max-w-[900px] sm:max-w-[800px] p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Header */}
          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold">
              {disabledTabs ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {(disabledTabs
                ? "Edit the transaction details for "
                : "Add a new transaction to ") +
                (account?.name || "your account")}
            </DialogDescription>
          </div>

          {/* Transaction Type & Form Fields */}
          <div className="mb-2">
            <Tabs
              value={transactionType.toString()}
              onValueChange={(value) => {
                if (disabledTabs) return;
                setTransactionType(Number(value) as TransactionTypes);
                resetErrors();
              }}
              className={`border-0!`}
            >
              <TabsList
                variant="default"
                aria-disabled={disabledTabs}
                className="grid grid-cols-3 rounded-[10px]!"
              >
                {getEnumValues(CategoryType).map((key) => (
                  <TabsTrigger
                    disabled={
                      disabledTabs &&
                      TransactionTypes[key as keyof typeof TransactionTypes] !==
                        transactionType
                    }
                    key={"add-transaction-for-current-account-" + key}
                    value={CategoryType[
                      key as keyof typeof CategoryType
                    ].toString()}
                    className="rounded-[10px]! px-4!"
                  >
                    {
                      TransactionTypeIcons[
                        key as keyof typeof TransactionTypeIcons
                      ]
                    }
                    <span className="ml-0.5">{key}</span>
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
                  defaultValue={values.currencyId}
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
                      defaultValue={account?.currency.id.toString()}
                      disabled={true}
                      onChange={(value) => onChangeValue("currencyId", value)}
                    />
                  }
                  className="pl-[116px]!"
                />
              </div>

              {currencyRate?.item && (
                <span className="text-xs font-semibold text-muted-foreground mt-1 ml-1">
                  {currencyRate?.item
                    ? `${values.amount || 0} ${currencyRate.item.baseCurrencyCode} = ${formatCurrency(currencyRate.item.rate * values.amount, 3)} ${currencyRate.item.targetCurrencyCode}`
                    : ""}
                </span>
              )}
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
                value={values.date}
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
                defaultValue={values.description}
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
                  }}
                  defaultValue={values.categoryId}
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
                defaultValue={values.accountId}
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
                  defaultValue={values.destinationAccountId}
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

          {/* Form Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                props.setOpen(false);
                resetFormState();
              }}
            >
              Discard changes
            </Button>
            <Button type="submit" className="min-w-[100px]">
              {disabledTabs ? "Save Changes" : "Add Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
