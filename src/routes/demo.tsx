import { createFileRoute } from "@tanstack/react-router";
import Input from "../components/reusable/inputs/Input";
import Validator from "../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../utils/hooks/useValidation";
import { useValidation } from "../utils/hooks/useValidation/useValidation";
import IconLink from "../components/IconLink";
import { FaceSmileIcon } from "@heroicons/react/16/solid";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/demo")({
  component: RouteComponent,
});

function RouteComponent() {
  const formValidator = new Validator().forProperty("email").check(VALIDATIONS.isRequired, "test is required");

  const { values, errors, onChangeInput } = useValidation(formValidator);

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center">
        <Button className="btn btn-sm">.btn .btn-sm</Button>
        <Button className="btn">.btn</Button>
        <Button className="btn btn-lg">.btn .btn-lg</Button>
        <Button className="btn btn-outline">.btn .btn-outline</Button>
      </div>

      <div>
        <input className="input pl-2!" placeholder="input.input" />

        <Input name="test" label="test" placeholder="Input" />
        <Input name="test" leftElement="#" size="sm" label="test" placeholder="Input (size sm)" />
        <Input name="test" leftElement="#" size="lg" label="Test" placeholder="Input (size lg)" />
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
          <IconLink href="/" icon={<FaceSmileIcon />} text="Face Smile" size="sm" />

          <IconLink href="/" icon={<FaceSmileIcon />} text="Face Smile" />

          <IconLink href="/" icon={<FaceSmileIcon />} text="Face Smile" size="lg" />
        </div>
      </div>
    </div>
  );
}
