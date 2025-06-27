import { useState } from "react";
import type Validator from "./Validator";

export const useValidation = (validator: Validator) => {
  const formData = validator.getConfiguration();
  const checkOnlyOnSubmit = validator.getCheckOnlyOnSubmit();

  const [values, setValues] = useState<{ [key: string]: string | string[] | boolean | number | number[] }>(
    Object.keys(formData).reduce(
      (acc, el) => {
        acc[el] = formData[el].value;
        return acc;
      },
      {} as { [key: string]: string | string[] | boolean | number | number[] }
    )
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>(
    Object.keys(formData).reduce(
      (acc, el) => {
        acc[el] = "";
        return acc;
      },
      {} as { [key: string]: string }
    )
  );

  const onChangeInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = ev.target;
    const inputValue = typeof values[name] === "boolean" ? checked : value;
    setErrors({ ...errors, [name]: "" });

    setValues({
      ...values,
      [name]: inputValue,
    });

    if (checkOnlyOnSubmit) {
      return;
    }

    setErrors({
      ...errors,
      [name]: formData[name].validations.find((validation: any) => !validation.check(inputValue)).errorMessage,
    });
  };

  const handleCheckFormErrors = () => {
    const errors: { [key: string]: string } = {};
    Object.keys(values).map((key) => {
      const validation = formData[key].validations.find((validation: any) => !validation.check(values[key]));
      errors[key] = validation ? validation.errorMessage : "";
    });
    setErrors({ ...errors });

    return Object.keys(errors).filter((key) => typeof errors[key] === "string" && errors[key].trim() !== "").length > 0;
  };

  return {
    values,
    setValues,
    errors,
    onChangeInput,
    handleCheckFormErrors,
  };
};
