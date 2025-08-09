import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useValidation } from "../../../../../utils/hooks/useValidation/useValidation";
import Validator from "../../../../../hooks/useValidation/Validator";
import VALIDATIONS from "../../../../../utils/hooks/useValidation";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { createUserAccount, updateUserAccount, type CreateAccount } from "../../../../../actions/accounts/userAccounts";
import Input from "../../../../../components/reusable/inputs/Input";
import CachedSelect from "../../../../../components/reusable/selects/CachedSelect";
import { toast } from "sonner";

interface IUpdateCreateAccountProps {
  id?: string;
  data?: CreateAccount;
}
export default function UpdateCreateAccount(props: IUpdateCreateAccountProps) {
  const queryClient = useQueryClient();
  const { errors, handleCheckFormErrors, onChangeInput, onChangeValue, setValues } = useValidation(
    new Validator()
      .forProperty("name")
      .check(VALIDATIONS.isRequired, "At least one character is required.")
      .forProperty("description")
      .check(VALIDATIONS.isRequired, "At least one character is required.")
      .forProperty("accountTypeId")
      .check(VALIDATIONS.isRequired, "Account type is required.")
      .forProperty("currencyId")
      .check(VALIDATIONS.isRequired, "Currency is required.")
      .forProperty("description")
      .check(VALIDATIONS.isRequired, "At least one character is required.")
      .applyCheckOnlyOnSubmit()
  );

  const { mutate, isPending } = useMutation({
    mutationKey: ["accounts", props.id || "create"],
    mutationFn: (data: CreateAccount) => {
      return props.id ? updateUserAccount(props.id, data) : createUserAccount(data);
    },
  });
  const router = useRouter();
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (handleCheckFormErrors()) {
      return;
    }

    const name = new FormData(ev.currentTarget).get("name") as string;

    mutate(
      {
        accountTypeId: (new FormData(ev.currentTarget).get("accountTypeId") || 0) as number,
        balance: (new FormData(ev.currentTarget).get("balance") || 0) as number,
        color: (new FormData(ev.currentTarget).get("color") as string) || "#000000",
        currencyId: (new FormData(ev.currentTarget).get("currencyId") || 0) as number,
        name: name,
        description: new FormData(ev.currentTarget).get("description") as string | null,
        userId: 1,
      },
      {
        onSuccess() {
          toast(`Account ${name ? "updated" : "created"} successfully`, {
            description: `Account '${name}' ${props.id ? "updated" : "created"} successfully`,
            duration: 3000,
          });
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
          router.navigate({ to: "/dashboard/settings/accounts" });
        },
        onError(error) {
          console.error("Error creating account type", error);
        },
      }
    );
  };

  useEffect(() => {
    if (props.data !== undefined && props.data !== null) {
      for (const accountKey of Object.keys(props.data || {})) {
        setValues((prevState) =>
          Object.keys(prevState).includes(accountKey)
            ? {
                ...prevState,
                [accountKey]: (props.data as any)[accountKey],
              }
            : prevState
        );
      }
    }
  }, [props.data, setValues]);

  return (
    <div className="py-8 px-8">
      <h3>Let's {props.data?.name ? "update your " : "create a new "} account</h3>
      <p className="text-base text-main-washed">
        This account will allow you to manage your transactions more efficiently.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input
          errorMessage={errors["name"]}
          onChange={onChangeInput}
          defaultValue={props.data?.name || ""}
          name="name"
          className="w-full text-sm"
          placeholder="Name: Vouchers"
        />

        <CachedSelect
          onChange={(value) => onChangeValue("accountTypeId", value)}
          errorMessage={errors["accountTypeId"]}
          defaultValue={props.data?.accountTypeId.toString() || ""}
          name="accountTypeId"
          entityName="account-types"
          placeholder="Select Account Type"
        />

        <CachedSelect
          onChange={(value) => onChangeValue("currencyId", value)}
          errorMessage={errors["currencyId"]}
          defaultValue={props.data?.currencyId.toString() || ""}
          name="currencyId"
          entityName="currencies"
          placeholder="Select Currency"
        />

        <Input
          errorMessage={errors["description"]}
          mode="textarea"
          onChange={onChangeInput}
          defaultValue={props.data?.description || ""}
          name="description"
          className="w-full text-sm mt-2"
          placeholder="Description: Accounts for extra income"
        />
        <div className="flex gap-2 self-end">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => router.navigate({ to: "/dashboard/settings/accounts" })}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isPending ? "Loading..." : props.data?.name ? "Edit" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
