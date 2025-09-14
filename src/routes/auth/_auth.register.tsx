import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import InputCode from "../../components/reusable/inputs/InputCode";
import { createEnhancedAxios } from "../../configs/axios";
import { Button } from "../../components/ui/button";
import { useValidation } from "../../utils/hooks/useValidation/useValidation";
import Validator from "../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../utils/hooks/useValidation";
import CustomInput from "../../components/reusable/inputs/CustomInput";
import { ChevronLeft, EyeClosedIcon, EyeIcon } from "lucide-react";

export const Route = createFileRoute("/auth/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [active, setIsActive] = useState(false);
  const [confirmPasswordActive, setConfirmPasswordActive] = useState(false);

  // Timer for resend code
  const [counter, setCounter] = useState(0);
  const timer = useRef<number | null>(null);

  const router = useRouter();

  const { errors, onChangeInput, applyErrorsFromApi, setErrors } = useValidation(
    new Validator()
      .forProperty("email")
      .check(VALIDATIONS.isEmail, "Invalid email")
      .forProperty("password")
      .check(VALIDATIONS.isRequired, "Password is required")
      .forProperty("confirmPassword")
      .check(VALIDATIONS.isRequired, "Confirm password is required")
  );

  useEffect(() => {
    if (isRegistered) {
      timer.current = window.setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1);
      }, 1000);
    } else {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [isRegistered]);

  useEffect(() => {
    if (counter >= 300) {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }
  }, [counter]);

  return (
    <div className="mx-auto py-20 flex flex-col justify-between h-full">
      <div className="absolute top-0 left-20">
        <Button variant="link" className="text-primary" onClick={() => router.navigate({ to: "/auth/login" })}>
          <ChevronLeft /> Back
        </Button>
      </div>
      {!isRegistered ? (
        <>
          <h1>Finovora</h1>

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
                setErrors({ ...errors, email: "", password: "", confirmPassword: "" });
                e.preventDefault();

                const formData = new FormData(e.currentTarget);
                const email = formData.get("email");
                const password = formData.get("password");
                const confirmPassword = formData.get("confirmPassword");
                createEnhancedAxios(undefined, applyErrorsFromApi)
                  .post(`${import.meta.env.VITE_API_URL}/auth/register`, { email, password, confirmPassword })
                  .then(() => {
                    // set client details
                    setIsRegistered(true);
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
                    <EyeIcon onClick={() => setIsActive(!active)} className="h-4 w-4 select-none" />
                  ) : (
                    <EyeClosedIcon onClick={() => setIsActive(!active)} className="h-4 w-4 select-none" />
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
                      className="h-4 w-4 select-none"
                    />
                  ) : (
                    <EyeClosedIcon
                      onClick={() => setConfirmPasswordActive(!confirmPasswordActive)}
                      className="h-4 w-4 select-none"
                    />
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
                Already having an account?
                <Link
                  className="text-center inline-block hover:decoration-1 hover:underline text-muted-foreground ml-1"
                  to="/auth/login"
                >
                  Log in here
                </Link>
              </span>
            </form>
          </div>

          <div className="text-center">
            <Link className="text-sm text-muted-foreground" to="/auth/forgot-password">
              Forgot your password?
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="mt-10">
            <h3 className="text-center">An verification email have been sent!</h3>
            <p className="text-center mt-4">Enter the code you got via email in order to verify your account</p>
            <InputCode
              className="!items-center my-6"
              onComplete={(val) => {
                createEnhancedAxios()
                  .get(`${import.meta.env.VITE_API_URL}/auth/email/verify/${val}`)
                  .then(() => {
                    router.navigate({ to: "/auth/login" });
                  });
              }}
              loading={false}
            />

            <div className="flex items-center flex-col">
              <p>Didn't receive the code?</p>
              <Button>Resend code</Button>
            </div>

            <div className="text-center mt-4">
              <p className="text-2xl text-foreground">
                {Math.floor((300 - counter) / 60)}:{(300 - counter) % 60 < 10 ? "0" : ""}
                {(300 - counter) % 60}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
