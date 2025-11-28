import { useState } from "react";
import Validator from "./Validator";

type ValidationRule = {
  check: (value: any) => boolean;
  errorMessage: string;
};

export const useValidation = (validator: Validator) => {
  const formData = validator.getConfiguration();
  const checkOnlyOnSubmit = validator.getCheckOnlyOnSubmit();

  const [values, setValues] = useState(
    Object.keys(formData).reduce(
      (acc, el) => {
        acc[el] = formData[el].value;
        return acc;
      },
      {} as { [key: string]: any }
    )
  );
  const [errors, setErrors] = useState(
    Object.keys(formData).reduce(
      (acc, el) => {
        acc[el] = "";
        return acc;
      },
      {} as { [key: string]: any }
    )
  );

  const onChangeInput = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = ev.target;
    const checked = (ev.target as HTMLInputElement).checked || false;
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
      [name]: formData[name].validations.find(
        (validation: ValidationRule) => !validation.check(inputValue)
      )?.errorMessage,
    });
  };

  const onChangeValue = (name: string, value: string) => {
    setErrors({ ...errors, [name]: "" });
    setValues({
      ...values,
      [name]: value,
    });

    if (checkOnlyOnSubmit) {
      return;
    }

    console.log(value);
    console.log(formData[name].validations);
    console.log(formData[name].validations.find(
      (validation: ValidationRule) => !validation.check(value)
    )?.errorMessage);

    setErrors({
      ...errors,
      [name]: formData[name].validations.find(
        (validation: ValidationRule) => !validation.check(value)
      )?.errorMessage,
    });
  };

  const handleCheckFormErrors = (fields?: string[]) => {
    const keysToValidate = fields ?? Object.keys(values);
    const updatedErrors = { ...errors };

    keysToValidate.forEach((key) => {
      if (!formData[key]) {
        return;
      }
      const validation = formData[key].validations.find(
        (validation: ValidationRule) => !validation.check(values[key])
      );
      updatedErrors[key] = validation ? validation.errorMessage : "";
    });

    setErrors(updatedErrors);

    return keysToValidate.some(
      (key) =>
        typeof updatedErrors[key] === "string" &&
        updatedErrors[key].trim() !== ""
    );
  };

  const applyErrorsFromApi = (errors: any[]) => {
    const errorsToAppend = {} as { [key: string]: string };
    errors.forEach((error) => {
      errorsToAppend[error.path] = error.message;
    });

    setErrors({ ...errors, ...errorsToAppend });
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    onChangeInput,
    handleCheckFormErrors,
    applyErrorsFromApi,
    onChangeValue,
  };
};
