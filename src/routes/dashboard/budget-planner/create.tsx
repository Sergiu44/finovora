import { createFileRoute } from "@tanstack/react-router";
import BaseWrapper from "../../../components/reusable/layouts/BaseWrapper";
import CachedSelect from "../../../components/reusable/selects/CachedSelect";
import { useValidation } from "../../../utils/hooks/useValidation/useValidation";
import Validator from "../../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../../utils/hooks/useValidation";
import { useQuery } from "@tanstack/react-query";
import { getUserAccounts } from "../../../utils/actions/accounts/userAccounts";

export const Route = createFileRoute("/dashboard/budget-planner/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const { handleCheckFormErrors, errors, onChangeValue } = useValidation(
    new Validator()
      .forProperty("account")
      .check(VALIDATIONS.isRequired, "Account is required")
      .forProperty("budget")
      .check(VALIDATIONS.isRequired, "Budget is required")
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleCheckFormErrors()) {
      return;
    }
  };

  const { data, status } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => await getUserAccounts(),
  });

  return (
    <BaseWrapper>
      <h1>Create Budget</h1>
      <form onSubmit={handleSubmit}>
        {data?.map((account) => <div>{account.name}</div>)}
      </form>
    </BaseWrapper>
  );
}
