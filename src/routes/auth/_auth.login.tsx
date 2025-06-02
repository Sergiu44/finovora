import { createFileRoute, Link } from "@tanstack/react-router";
import Input from "../../components/Input";
import { EyeIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { EyeSlashIcon } from "@heroicons/react/20/solid";

export const Route = createFileRoute("/auth/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [active, setIsActive] = useState(false);
  return (
    <div className="w-3/4 mx-auto py-20 flex flex-col justify-between h-full">
      <h1>Finovora</h1>

      <div className="">
        <div className="mb-10 block">
          <h3 className="block!">Sign in into your account</h3>
          <p className="tracking-tight mt-2 mb-6 text-[var(--bg-main)] ">
            Access your account in order to be able to start a budget plan
          </p>
        </div>
        <form className="block">
          <Input name="email" type="email" className="border border-neutral-200 w-full" placeholder="Enter email..." />
          <Input
            leftElement={
              active ? (
                <EyeSlashIcon onClick={() => setIsActive(false)} className="fill-neutral-400 cursor-pointer h-4 w-4" />
              ) : (
                <EyeIcon onClick={() => setIsActive(true)} className="fill-neutral-400 cursor-pointer h-4 w-4" />
              )
            }
            name="password"
            type={active ? "text" : "password"}
            className="border border-neutral-200 w-full pl-6!"
            placeholder="Enter password..."
          />
          <button className="btn font-bold btn-secondary w-full mt-2">Submit</button>

          <div className="grid grid-cols-[1fr_30px_1fr] my-8">
            <div></div>
            <span className="text-center">OR</span>
            <div></div>
          </div>

          <button className="btn font-bold btn-outline w-full">Continue with Google</button>
          <Link
            className="text-center hover:decoration-1 hover:underline text-base text-[var(--bg-main)] mt-6 block"
            to="/auth/register"
          >
            Don't have an account yet? Start here
          </Link>
        </form>
      </div>

      <div className="text-center">
        <Link className="text-base  text-[var(--main-washed)]" to="/auth/forgot-password">
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
