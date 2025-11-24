import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useValidation } from "../../../../../utils/hooks/useValidation/useValidation";
import VALIDATIONS from "../../../../../utils/hooks/useValidation";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  createUserAccount,
  updateUserAccount,
  type CreateAccount,
} from "../../../../../utils/actions/accounts/userAccounts";
import CachedSelect from "../../../../../components/reusable/selects/CachedSelect";
import { toast } from "sonner";
import { Button } from "../../../../../components/ui/button";
import Validator from "../../../../../utils/hooks/useValidation/Validator";
import { Input } from "../../../../../components/ui/input";
import CustomInput from "../../../../../components/reusable/inputs/CustomInput";
import GradientCard from "./GradientCard";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import AccountPreviewCard from "./AccountPreviewCard";
import CreateNewUserGrandient from "./CreateNewUserGrandient";
import { getUserGradientsAsync } from "../../../../../utils/actions/users/userGradients";
import {
  getDefaultGradientsAsync,
  isDefaultGradientItem,
} from "../../../../../utils/actions/nomenclatures/defaultGradient";
import ErrorMessage from "../../../../../components/reusable/errorMessages/errorMessage";

interface IUpdateCreateAccountProps {
  id?: string;
  data?: CreateAccount;
}
export default function UpdateCreateAccount(props: IUpdateCreateAccountProps) {
  const { data: defaultGradientData } = useQuery({
    queryKey: ["defaultGradients"],
    queryFn: () => getDefaultGradientsAsync(),
  });

  const { data: userGradientData } = useQuery({
    queryKey: ["userGradients"],
    queryFn: () => getUserGradientsAsync(),
  });

  const queryClient = useQueryClient();
  const {
    errors,
    setErrors,
    handleCheckFormErrors,
    onChangeInput,
    onChangeValue,
    values,
    setValues,
  } = useValidation(
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
      .forProperty("gradientId")
      .check(VALIDATIONS.isRequired, "Color is required")
      .forProperty("type")
      .check(VALIDATIONS.isRequired, "Color is required")
      .applyCheckOnlyOnSubmit()
  );

  const { mutate, isPending } = useMutation({
    mutationKey: ["accounts", props.id || "create"],
    mutationFn: (data: CreateAccount) => {
      return props.id
        ? updateUserAccount(props.id, data)
        : createUserAccount(data);
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
        accountTypeId: (new FormData(ev.currentTarget).get("accountTypeId") ||
          0) as number,
        balance: (new FormData(ev.currentTarget).get("balance") || 0) as number,
        gradientId: values.gradientId,
        currencyId: (new FormData(ev.currentTarget).get("currencyId") ||
          0) as number,
        name: name,
        description: new FormData(ev.currentTarget).get("description") as
          | string
          | null,
        userId: 1,
        type: values.type,
      },
      {
        onSuccess() {
          toast.success(
            `Account ${name ? "updated" : "created"} successfully`,
            {
              description: `Account '${name}' ${props.id ? "updated" : "created"} successfully`,
              duration: 3000,
            }
          );
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
    <div className="py-4 px-2">
      <h3 className="text-2xl font-bold ml-1">
        Let's {props.data?.name ? "update your " : "create a new "} account
      </h3>
      <p className="text-sm text-muted-foreground mb-4! ml-1">
        This account will allow you to manage your transactions more
        efficiently.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-0">
        <Input
          onChange={onChangeInput}
          defaultValue={props.data?.name || ""}
          name="name"
          className="w-full text-sm"
          placeholder="Account Name: Vouchers, Revolut, etc."
        />
        {errors["name"] && (
          <ErrorMessage wrapperClassName="ml-1" errorMessage={errors["name"]} />
        )}

        <CachedSelect
          onChange={(value) => onChangeValue("accountTypeId", value)}
          errorMessage={errors["accountTypeId"]}
          defaultValue={props.data?.accountTypeId?.toString() ?? ""}
          name="accountTypeId"
          entityName="account-types"
          placeholder="Select Account Type"
        />

        <CachedSelect
          onChange={(value) => onChangeValue("currencyId", value)}
          errorMessage={errors["currencyId"]}
          defaultValue={props.data?.currencyId?.toString() ?? ""}
          name="currencyId"
          entityName="currencies"
          placeholder="Select Currency"
        />

        <CustomInput
          onChange={onChangeInput}
          defaultValue={props.data?.description || ""}
          name="description"
          className="w-full text-sm mt-2"
          placeholder="Description: Accounts for extra income"
        />
        {errors["description"] && (
          <ErrorMessage
            wrapperClassName="ml-1"
            errorMessage={errors["description"]}
          />
        )}

        <h3 className="mt-6 mb-2! font-bold text-lg ml-2">
          Select account card color
        </h3>
        {(errors["gradientId"] || errors["type"]) && (
          <ErrorMessage
            wrapperClassName="ml-1"
            errorMessage={errors["gradientId"] || errors["type"]}
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {defaultGradientData &&
            defaultGradientData.items.length > 0 &&
            defaultGradientData.items.map((item) => (
              <GradientCard
                key={"default-gradient-" + item.id}
                isSelected={
                  values["gradientId"]?.toString() == item.id?.toString() && values["type"] == "default"
                }
                onSelect={() => {
                  setErrors({
                    ...errors,
                    gradientId: undefined,
                    type: undefined,
                  });
                  setValues({
                    ...values,
                    gradientId: item.id,
                    type: "default",
                  });
                }}
                card={{
                  ...item,
                  type: "default",
                  colors: [
                    item.color1,
                    item.color2,
                    item.color3,
                    item.color4,
                    item.color5,
                  ],
                }}
              />
            ))}

          {userGradientData &&
            userGradientData.items.length > 0 &&
            userGradientData.items.map((item) => (
              <GradientCard
                onDelete={(cardId) => {
                  queryClient.setQueryData(
                    ["userGradients"],
                    (oldData: any) => {
                      return {
                        ...oldData,
                        items: oldData.items.filter(
                          (item: any) => item.id !== cardId
                        ),
                      };
                    }
                  );
                }}
                key={"user-gradient-" + item.id}
                isSelected={
                  values["gradientId"]?.toString() == item.id?.toString() && values["type"] == "user"
                }
                onSelect={() => {
                  setErrors({
                    ...errors,
                    gradientId: undefined,
                    type: undefined,
                  });
                  setValues({ ...values, gradientId: item.id, type: "user" });
                }}
                card={{
                  colors: [item.to, item.from],
                  type: "user",
                  id: item.id,
                  name: item.name,
                  slug: item.slug,
                }}
              />
            ))}

          <CreateNewUserGrandient
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["userGradients"] });
            }}
          />
        </div>
        <div className="flex gap-2 self-end mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Account Preview</DialogTitle>
              </DialogHeader>
              <AccountPreviewCard
                name={values["name"]}
                description={values["description"]}
                accountType={
                  document.querySelector(
                    `select[name="accountTypeId"] option[value="${values["accountTypeId"]}"]`
                  )?.textContent || undefined
                }
                currency={
                  document.querySelector(
                    `select[name="currencyId"] option[value="${values["currencyId"]}"]`
                  )?.textContent || undefined
                }
                gradient={(() => {
                  const selectedGradient =
                    values.type === "default"
                      ? defaultGradientData?.items.find(
                          (item) => item.id.toString() == values["gradientId"]
                        )
                      : userGradientData?.items.find(
                          (item) => item.id.toString() == values["gradientId"]
                        );
                  if (!selectedGradient) return undefined;

                  return {
                    ...selectedGradient,
                    type: "default",
                    colors: isDefaultGradientItem(selectedGradient)
                      ? [
                          selectedGradient.color1,
                          selectedGradient.color2,
                          selectedGradient.color3,
                          selectedGradient.color4,
                          selectedGradient.color5,
                        ]
                      : [selectedGradient.to, selectedGradient.from],
                  };
                })()}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            type="button"
            onClick={() =>
              router.navigate({ to: "/dashboard/settings/accounts" })
            }
          >
            Cancel
          </Button>
          <Button type="submit">
            {isPending ? "Loading..." : props.data?.name ? "Edit" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
