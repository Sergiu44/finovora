import { useState } from "react";
import Validator from "./Validator";

export const useValidation = (validator: Validator) => {
  const formData = validator.getConfiguration();
  const checkOnlyOnSubmit = validator.getCheckOnlyOnSubmit();

  const [values, setValues] = useState(
    Object.keys(formData).reduce((acc, el) => {
      acc[el] = formData[el].value;
      return acc;
    }, {} as { [key: string]: any })
  );
  const [errors, setErrors] = useState(
    Object.keys(formData).reduce((acc, el) => {
      acc[el] = "";
      return acc;
    }, {} as { [key: string]: any })
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
      [name]: formData[name].validations.find(
        (validation: { check: Function, errorMessage: string }) => !validation.check(inputValue)
      )?.errorMessage,
    });
  };

  const handleCheckFormErrors = () => {
    let errors = {} as { [key: string]: string };
    Object.keys(values).map((key) => {
      const validation = formData[key].validations.find(
        (validation: { check: Function }) => !validation.check(values[key])
      );
      errors[key] = validation ? validation.errorMessage : "";
    });
    setErrors({ ...errors });

    return (
      Object.keys(errors).filter(
        (key) => typeof errors[key] === "string" && errors[key].trim() !== ""
      ).length > 0
    );
  };

  const applyErrorsFromApi = (errors: { [key: string]: string[] }) => {
    let errorsToAppend = {} as { [key: string]: string };
    Object.keys(errors).map((key) => {
      errorsToAppend[key] = errors[key][0];
    });

    setErrors({ ...errors, ...errorsToAppend });
  };

  return {
    values,
    setValues,
    errors,
    onChangeInput,
    handleCheckFormErrors,
    applyErrorsFromApi,
  };
};
