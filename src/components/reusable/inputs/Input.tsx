import React from "react";
import type { BaseProps } from "../../../types/components/BaseProps";

interface InputProps extends BaseProps {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  placeholder?: string;
  label?: string;
  name: string;
  type?: string;
  value?: string;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  id?: string;
}

export default function Input({
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
  value,
}: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={`label ${size && "label-" + size}`}>
          {label}
        </label>
      )}
      <div className="flex items-center relative mt-2">
        {leftElement && <div className={`inputLeft ${size && "inputLeft-" + size}`}>{leftElement}</div>}
        <input
          onChange={onChange}
          value={value}
          id={id}
          name={name}
          type={type}
          className={`input ${size && "input-" + size} ${className} ${!leftElement && "pl-3!"}`}
          placeholder={placeholder}
        />

        {rightElement && <div className={`inputRight ${size && "inputRight-" + size}`}>{rightElement}</div>}
      </div>
      {errorMessage && <p className={`inputError ${size && "inputError-" + size}`}>{errorMessage}</p>}
    </div>
  );
}
