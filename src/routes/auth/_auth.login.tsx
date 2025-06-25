import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import Input from "../../components/reusable/inputs/Input";
import { EyeIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { EyeSlashIcon } from "@heroicons/react/20/solid";
import { createEnhancedAxios } from "../../configs/axios";

export const Route = createFileRoute("/auth/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [active, setIsActive] = useState(false);

  const router = useRouter();

  return (
    <div className="w-3/4 mx-auto py-20 flex flex-col justify-between h-full">
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
            createEnhancedAxios()
              .post(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                { email, password },
                {
                  withCredentials: true,
                }
              )
              .then(({ data }) => {
                const { user, message } = data;
                alert(message);
                localStorage.setItem("user", JSON.stringify(user));
                router.navigate({ to: "/dashboard" });
              });
          }}
        >
          <Input name="email" type="email" className="border border-neutral-200 w-full" placeholder="Enter email..." />
          <Input
            rightElement={
              active ? (
                <EyeSlashIcon
                  onClick={() => setIsActive(false)}
                  className="fill-neutral-400 hover:fill-neutral-500 cursor-pointer h-4 w-4"
                />
              ) : (
                <EyeIcon
                  onClick={() => setIsActive(true)}
                  className="fill-neutral-400 hover:fill-neutral-500 cursor-pointer h-4 w-4"
                />
              )
            }
            name="password"
            type={active ? "text" : "password"}
            className="border border-neutral-200 w-full"
            placeholder="Enter password..."
          />
          <button className="btn btn-secondary w-full mt-2">Submit</button>

          <div className="grid grid-cols-[1fr_30px_1fr] my-4">
            <div></div>
            <span className="text-center">OR</span>
            <div></div>
          </div>

          <button className="btn  btn-outline w-full">Continue with Google</button>
          <span className="mt-6 inline-block w-full text-center text-base">
            Don't have an account yet?
            <Link
              className="text-center inline-block hover:decoration-1 hover:underline text-[var(--color-bg-main)] ml-1"
              to="/auth/register"
            >
              Start here
            </Link>
          </span>
        </form>
      </div>

      <div className="text-center">
        <Link className="text-sm text-[var(--color-main-washed)]" to="/auth/forgot-password">
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
