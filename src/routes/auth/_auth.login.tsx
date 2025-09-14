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
  const { errors, onChangeInput, applyErrorsFromApi, setErrors } = useValidation(
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
    <div className="mx-auto pb-20 flex flex-col justify-between h-full">
      <div className="">
        <div className="mb-4 block">
          <h3 className="text-lg">Sign in into your account</h3>
          <p className="text-sm text-muted-foreground font-bold">
            Access your account in order to be able to start a budget plan
          </p>
        </div>
        <form
          className="block"
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
                const { user } = data;

                setUserMainAccountId(user.primaryAccountId);
                localStorage.setItem("user", JSON.stringify(user));
                router.navigate({ to: "/dashboard" });
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
                <EyeIcon onClick={() => setIsActive(!active)} className="h-4 w-4 select-none" />
              ) : (
                <EyeClosedIcon onClick={() => setIsActive(!active)} className="h-4 w-4 select-none" />
              )
            }
          />
          <Button variant="secondary" className="w-full mt-2">
            Submit
          </Button>

          <div className="grid grid-cols-[1fr_30px_1fr] my-4">
            <div></div>
            <span className="text-center">OR</span>
            <div></div>
          </div>

          <Button className="w-full">Continue with Google</Button>
          <span className="mt-6 inline-block w-full text-center text-base">
            Don't have an account yet?
            <Link
              className="text-center inline-block hover:decoration-1 hover:underline text-muted-foreground ml-1"
              to="/auth/register"
            >
              Start here
            </Link>
          </span>
        </form>
      </div>

      <div className="text-center">
        <Link className="text-sm text-muted-foreground" to="/auth/forgot-password">
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
