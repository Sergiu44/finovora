import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createEnhancedAxios } from "../../configs/axios";
import { Button } from "../../components/ui/button";
import { useValidation } from "../../utils/hooks/useValidation/useValidation";
import Validator from "../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../utils/hooks/useValidation";
import CustomInput from "../../components/reusable/inputs/CustomInput";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

export const Route = createFileRoute("/auth/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const [active, setIsActive] = useState(false);
  const [confirmPasswordActive, setConfirmPasswordActive] = useState(false);

  const { errors, onChangeInput, applyErrorsFromApi, setErrors } =
    useValidation(
      new Validator()
        .forProperty("email")
        .check(VALIDATIONS.isEmail, "Invalid email")
        .forProperty("password")
        .check(VALIDATIONS.isRequired, "Password is required")
        .forProperty("confirmPassword")
        .check(VALIDATIONS.isRequired, "Confirm password is required")
    );

  return (
    <div className="mx-auto flex flex-col">
      <div className="mb-4 block text-center">
        <h3 className="text-3xl text-popover-foreground">
          Sign in into your account
        </h3>
        <p className="text-sm text-muted-foreground font-bold mt-2">
          Access your account in order to be able to start a budget plan
        </p>
      </div>
      <form
        className="block mt-8"
        onSubmit={(e) => {
          setErrors({
            ...errors,
            email: "",
            password: "",
            confirmPassword: "",
          });
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const email = formData.get("email");
          const password = formData.get("password");
          const confirmPassword = formData.get("confirmPassword");
          createEnhancedAxios(undefined, applyErrorsFromApi)
            .post(`${import.meta.env.VITE_API_URL}/auth/register`, {
              email,
              password,
              confirmPassword,
            })
            .then(() => {
              // Redirect to verify-email page with email and verification code
              router.navigate({
                to: "/auth/verify-email",
                search: {
                  email: email as string,
                },
              });
            });
        }}
      >
        <CustomInput
          name="email"
          onChange={onChangeInput}
          type="email"
          className="mt-2 mb-1"
          placeholder="Enter email..."
          errorMessage={errors["email"]}
        />

        <CustomInput
          name="password"
          type={active ? "text" : "password"}
          placeholder="Enter password..."
          onChange={onChangeInput}
          className="mb-1"
          errorMessage={errors["password"]}
          leftElement={
            active ? (
              <EyeIcon
                onClick={() => setIsActive(!active)}
                className="h-4 w-4 select-none text-muted-foreground"
              />
            ) : (
              <EyeClosedIcon
                onClick={() => setIsActive(!active)}
                className="h-4 w-4 select-none text-muted-foreground"
              />
            )
          }
        />

        <CustomInput
          name="confirmPassword"
          type={confirmPasswordActive ? "text" : "password"}
          placeholder="Confirm password..."
          onChange={onChangeInput}
          className="mb-1"
          errorMessage={errors["confirmPassword"]}
          leftElement={
            confirmPasswordActive ? (
              <EyeIcon
                onClick={() => setConfirmPasswordActive(!confirmPasswordActive)}
                className="h-4 w-4 select-none text-muted-foreground"
              />
            ) : (
              <EyeClosedIcon
                onClick={() => setConfirmPasswordActive(!confirmPasswordActive)}
                className="h-4 w-4 select-none text-muted-foreground"
              />
            )
          }
        />

        <Button variant="accent" className="w-full mt-2">
          Submit
        </Button>

        <div className="grid grid-cols-[1fr_30px_1fr] my-4 items-center gap-2">
          <div className="h-[1px] bg-muted-foreground"></div>
          <span className="text-center text-popover-foreground">OR</span>
          <div className="h-[1px] bg-muted-foreground"></div>
        </div>

        <Button className="w-full">Continue with Google</Button>
      </form>

      <div className="mt-20 w-full justify-center text-base! text-muted-foreground flex">
        Already having an account?
        <Link
          className="text-center inline-block hover:decoration-1 hover:underline hover:underline-offset-2 text-primary ml-1"
          to="/auth/login"
        >
          Log in here
        </Link>
      </div>
      <div className="text-center mt-2">
        <Link className="text-sm text-primary" to="/auth/forgot-password">
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
