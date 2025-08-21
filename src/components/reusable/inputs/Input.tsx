import React, { type Ref } from "react";
import type { BaseProps } from "../../../types/components/BaseProps";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { Input } from "../../ui/input";

interface InputProps extends BaseProps {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  placeholder?: string;
  label?: string;
  name: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errorMessage?: string;
  id?: string;
  mode?: "input" | "textarea";
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: (ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function CustomInput({
  className,
  id,
  leftElement,
  rightElement,
  placeholder,
  label,
  type = "text",
  name,
  size,
  errorMessage,
  onChange,
  onBlur,
  defaultValue,
  ref,
  value,
  mode = "input",
}: InputProps) {
  return mode === "input" ? (
    <div>
      {label && (
        <label htmlFor={id} className={`label ${size && "label-" + size}`}>
          {label}
        </label>
      )}
      <div className="flex items-center relative">
        {leftElement && <div className={`inputLeft ${size && "inputLeft-" + size}`}>{leftElement}</div>}
        <Input
          onBlur={onBlur}
          ref={ref as Ref<HTMLInputElement>}
          defaultValue={defaultValue}
          onChange={onChange}
          value={value}
          id={id}
          name={name}
          type={type}
          className={`${className} ${!leftElement && "pl-3!"} ${errorMessage && "input-error"}`}
          placeholder={placeholder}
        />

        {rightElement && <div className={`inputRight ${size && "inputRight-" + size}`}>{rightElement}</div>}
      </div>
      {errorMessage && (
        <div className="flex gap-1 items-center mt-1.5">
          <ExclamationTriangleIcon className="h-3 w-3 text-error" />
          <p className={`inputError ${size && "inputError-" + size}`}>{errorMessage}</p>
        </div>
      )}
    </div>
  ) : (
    <div>
      {label && (
        <label htmlFor={id} className={`label ${size && "label-" + size}`}>
          {label}
        </label>
      )}

      <textarea
        onBlur={onBlur}
        ref={ref as Ref<HTMLTextAreaElement>}
        rows={4}
        defaultValue={defaultValue}
        onChange={onChange}
        value={value}
        id={id}
        name={name}
        className={`input ${size && "input-" + size} ${className} ${!leftElement && "pl-3!"} ${errorMessage && "input-error"}`}
        placeholder={placeholder}
      />

      {errorMessage && (
        <div className="flex gap-1 items-center mt-1.5">
          <ExclamationTriangleIcon className="h-3 w-3 text-error" />
          <p className={`inputError ${size && "inputError-" + size}`}>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
