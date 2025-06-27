import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useValidation } from "../../../../hooks/useValidation/useValidation";
import Validator from "../../../../hooks/useValidation/Validator";
import Input from "../../../../components/reusable/inputs/Input";

export const Route = createFileRoute("/dashboard/settings/accounts/account-types-create")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
  };
  const {} = useValidation(new Validator().forProperty("name"));
  return (
    <form onSubmit={handleSubmit}>
      <Input name="name" label="Account Type Name" placeholder="Enter account type name" />
      <button
        type="button"
        className="btn btn-sm text-sm px-3 py-2 mb-4"
        onClick={() => router.navigate({ to: "/dashboard/settings/accounts/account-types" })}
      >
        Back to Account Types
      </button>
      <button type="submit" className="btn btn-primary">
        Create
      </button>
    </form>
  );
}
