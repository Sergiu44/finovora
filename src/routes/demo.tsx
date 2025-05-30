import { createFileRoute } from "@tanstack/react-router";
import Input from "../components/Input";
import Validator from "../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../utils/hooks/useValidation";
import { useValidation } from "../utils/hooks/useValidation/useValidation";
import IconLink from "../components/IconLink";
import { FaceSmileIcon } from "@heroicons/react/16/solid";

export const Route = createFileRoute("/demo")({
  component: RouteComponent,
});

function RouteComponent() {
  const formValidator = new Validator()
    .forProperty("email")
    .check(VALIDATIONS.isRequired, "test is required");

  const { values, errors, onChangeInput } = useValidation(formValidator);

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center">
        <button className="btn btn-sm">Test</button>
        <button className="btn">Test</button>
        <button className="btn btn-lg">Test</button>
      </div>

      <div>
        <input className="input pl-2!" />

        <Input name="test" label="test" />
        <Input name="test" leftElement="#" size="sm" label="test" />
        <Input name="test" leftElement="#" size="lg" label="Test" />
        <Input name="no-test" size="lg" />
        <Input
          name="email"
          label="Email"
          size="sm"
          type="email"
          value={values.email}
          onChange={onChangeInput}
          errorMessage={errors.email}
        />

        <div className="w-96">
          <IconLink
            href="/"
            icon={<FaceSmileIcon />}
            text="Face Smile"
            size="sm"
          />

          <IconLink href="/" icon={<FaceSmileIcon />} text="Face Smile" />

          <IconLink
            href="/"
            icon={<FaceSmileIcon />}
            text="Face Smile"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}
