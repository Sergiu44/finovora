import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserAccountType,
  updateUserAccountType,
  type CreateAccountType,
} from "../../../../../../actions/accounts/userAccountTypes";
import { useValidation } from "../../../../../../utils/hooks/useValidation/useValidation";
import Validator from "../../../../../../hooks/useValidation/Validator";
import VALIDATIONS from "../../../../../../utils/hooks/useValidation";
import { useRouter } from "@tanstack/react-router";
import Input from "../../../../../../components/reusable/inputs/Input";
import { useEffect } from "react";
import { Button } from "../../../../../../components/ui/button";

interface IUpdateCreateAccountTypeProps {
  id?: string;
  data?: CreateAccountType;
}
export default function UpdateCreateAccountType(props: IUpdateCreateAccountTypeProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["accountTypes", props.id],
    mutationFn: (data: CreateAccountType) => {
      return props.id ? updateUserAccountType(props.id, data) : createUserAccountType(data);
    },
  });
  const router = useRouter();
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (handleCheckFormErrors()) {
      return;
    }

    mutation.mutate(
      {
        name: new FormData(ev.currentTarget).get("name") as string,
        description: new FormData(ev.currentTarget).get("description") as string | null,
        userId: 1,
      },
      {
        onSuccess(data) {
          console.log("Account type created successfully", data);
          queryClient.invalidateQueries({ queryKey: ["accountTypes"] });
          queryClient.invalidateQueries({ queryKey: ["accounts/accountTypes"] });
          router.navigate({ to: "/dashboard/settings/accounts/account-types" });
        },
        onError(error) {
          console.error("Error creating account type", error);
        },
      }
    );
    // Handle form submission logic here
    console.log("Form submitted");
  };
  const { errors, handleCheckFormErrors, onChangeInput, setValues } = useValidation(
    new Validator()
      .forProperty("name")
      .check(VALIDATIONS.isRequired, "At least one character is required.")
      .forProperty("description")
      .applyCheckOnlyOnSubmit()
  );

  useEffect(() => {
    if (props.data !== undefined) {
      for (const accountTypeKey of Object.keys(props.data || {})) {
        setValues((prevState) =>
          Object.keys(prevState).includes(accountTypeKey)
            ? {
                ...prevState,
                [accountTypeKey]: (props.data as any)[accountTypeKey],
              }
            : prevState
        );
      }
    }
  }, [props.data, setValues]);
  return (
    <div className="py-8 px-8">
      <h3>Let's {props.data?.name ? "update your " : "create a new "} account type</h3>
      <p className="text-base text-main-washed">
        This account type will allow you to manage you finance more efficiently.
      </p>
      <form onSubmit={handleSubmit}>
        <Input
          errorMessage={errors["name"]}
          onChange={onChangeInput}
          defaultValue={props.data?.name || ""}
          name="name"
          className="w-full"
          placeholder="Name: Vouchers"
        />
        <Input
          onChange={onChangeInput}
          defaultValue={props.data?.description || ""}
          name="description"
          className="w-full"
          placeholder="Description: Accounts for extra income"
        />
        <Button
          type="button"
          variant="ghost"
          className="mb-4"
          onClick={() => router.navigate({ to: "/dashboard/settings/accounts/account-types" })}
        >
          Cancel
        </Button>
        <Button type="submit">{props.data?.name ? "Edit" : "Create"}</Button>
      </form>
    </div>
  );
}
