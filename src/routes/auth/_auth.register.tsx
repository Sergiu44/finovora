import { EyeSlashIcon, EyeIcon } from "@heroicons/react/16/solid";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import Input from "../../components/reusable/inputs/Input";
import InputCode from "../../components/reusable/inputs/InputCode";
import { createEnhancedAxios } from "../../configs/axios";
export const Route = createFileRoute("/auth/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [active, setIsActive] = useState(false);
  const [activeConfirm, setIsActiveConfirm] = useState(false);

  // Timer for resend code
  const [counter, setCounter] = useState(0);
  const timer = useRef<number | null>(null);

  const router = useRouter();

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
    <div className="w-3/4 mx-auto py-20 flex flex-col justify-between h-full">
      {!isRegistered ? (
        <>
          <h1>Finovora</h1>

          <div className="">
            <div className="mb-10 block">
              <h3 className="block!">Sign in into your account</h3>
              <p className="tracking-tight mt-2 mb-6 text-[var(--color-bg-main)] ">
                Access your account in order to be able to start a budget plan
              </p>
            </div>
            <form
              className="block"
              onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.currentTarget);
                const email = formData.get("email");
                const password = formData.get("password");
                const confirmPassword = formData.get("confirmPassword");
                createEnhancedAxios()
                  .post(`${import.meta.env.VITE_API_URL}/auth/register`, { email, password, confirmPassword })
                  .then(() => {
                    // set client details
                    setIsRegistered(true);
                  });
              }}
            >
              <Input
                name="email"
                type="email"
                className="border border-neutral-200 w-full"
                placeholder="Enter email..."
              />
              <Input
                leftElement={
                  active ? (
                    <EyeSlashIcon
                      onClick={() => setIsActive(false)}
                      className="fill-neutral-400 cursor-pointer h-4 w-4"
                    />
                  ) : (
                    <EyeIcon onClick={() => setIsActive(true)} className="fill-neutral-400 cursor-pointer h-4 w-4" />
                  )
                }
                name="password"
                type={active ? "text" : "password"}
                className="border border-neutral-200 w-full pl-6!"
                placeholder="Enter password..."
              />

              <Input
                leftElement={
                  activeConfirm ? (
                    <EyeSlashIcon
                      onClick={() => setIsActiveConfirm(false)}
                      className="fill-neutral-400 cursor-pointer h-4 w-4"
                    />
                  ) : (
                    <EyeIcon
                      onClick={() => setIsActiveConfirm(true)}
                      className="fill-neutral-400 cursor-pointer h-4 w-4"
                    />
                  )
                }
                name="confirmPassword"
                type={activeConfirm ? "text" : "password"}
                className="border border-neutral-200 w-full pl-6!"
                placeholder="Confirm password..."
              />
              <button className="btn font-bold btn-secondary w-full mt-2">Submit</button>

              <div className="grid grid-cols-[1fr_30px_1fr] my-8">
                <div></div>
                <span className="text-center">OR</span>
                <div></div>
              </div>

              <button className="btn font-bold btn-outline w-full">Continue with Google</button>
              <Link
                className="text-center hover:decoration-1 hover:underline text-base text-[var(--color-bg-main)] mt-6 block"
                to="/auth/register"
              >
                Already having an account? Log in here
              </Link>
            </form>
          </div>

          <div className="text-center">
            <Link className="text-base  text-[var(--color-main-washed)]" to="/auth/forgot-password">
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
              <button className="btn text-[var(--color-white)] mt-2">Resend code</button>
            </div>

            <div className="text-center mt-4">
              <p className="text-2xl text-[var(--color-black)]">
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
