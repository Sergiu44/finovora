import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { createEnhancedAxios } from "../../configs/axios";
import { useUserMainAccount } from "../../context/UserMainAccount";
import { Button } from "../../components/ui/button";
import { useValidation } from "../../utils/hooks/useValidation/useValidation";
import Validator from "../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../utils/hooks/useValidation";
import CustomInput from "../../components/reusable/inputs/CustomInput";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { errors, onChangeInput, applyErrorsFromApi, setErrors } =
    useValidation(
      new Validator()
        .forProperty("email")
        .check(VALIDATIONS.isEmail, "Invalid email")
        .forProperty("password")
        .check(VALIDATIONS.isRequired, "Password is required")
    );
  const [active, setIsActive] = useState(false);
  const { setUserMainAccountId } = useUserMainAccount();

  const router = useRouter();

  return (
    <>
      <div className="mx-auto pb-20 flex flex-col">
        <div className="mb-4 block text-center">
          <h3 className="text-3xl text-popover-foreground">
            Sign in into your account
          </h3>
          <p className="text-sm text-muted-foreground font-bold mt-2">
            Access your account in order to be able to start a budget plan
          </p>
        </div>
        <form
          className="block mt-12"
          onSubmit={(e) => {
            setErrors({ ...errors, email: "", password: "" });
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const email = formData.get("email");
            const password = formData.get("password");
            createEnhancedAxios(undefined, applyErrorsFromApi)
              .post(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                { email, password },
                {
                  withCredentials: true,
                }
              )
              .then(({ data }) => {
                const { user, redirectTo } = data;

                if (!user.verified)
                  return createEnhancedAxios()
                    .post(`${import.meta.env.VITE_API_URL}/auth/email/send`, {
                      email,
                    })
                    .then(() => {
                      router.navigate({
                        to: "/auth/verify-email",
                        search: {
                          email: email as string,
                        },
                      });
                    });

                setUserMainAccountId(user.primaryAccountId);
                localStorage.setItem("user", JSON.stringify(user));
                router.navigate({ to: redirectTo });
              });
          }}
        >
          <CustomInput
            name="email"
            onChange={onChangeInput}
            type="email"
            placeholder="Enter email..."
            errorMessage={errors["email"]}
          />

          <CustomInput
            name="password"
            type={active ? "text" : "password"}
            placeholder="Enter password..."
            wrapperClassName="mt-2"
            onChange={onChangeInput}
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
          <Button variant="accent" className="w-full mt-2">
            Submit
          </Button>

          <div className="grid grid-cols-[1fr_30px_1fr] my-4 items-center gap-2">
            <div className="h-[1px] bg-muted-foreground"></div>
            <span className="text-center text-popover-foreground">OR</span>
            <div className="h-[1px] bg-muted-foreground"></div>
          </div>

          <Button className="w-full" type="button">
            Continue with Google
          </Button>
        </form>
      </div>

      <div className="w-full justify-center text-muted-foreground flex">
        <span>Don't have an account yet?</span>
        <Link
          className="text-center inline-block hover:decoration-1 hover:underline hover:underline-offset-2 ml-1 text-primary"
          to="/auth/register"
        >
          Start here
        </Link>
      </div>

      <div className="text-center mt-2">
        <Link className="text-sm text-primary" to="/auth/forgot-password">
          Forgot your password?
        </Link>
      </div>
    </>
  );
}
