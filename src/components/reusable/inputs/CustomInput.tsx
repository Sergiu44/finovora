import React, { type Ref } from "react";
import { Input } from "../../ui/input.tsx";
import ErrorMessage from "../errorMessages/errorMessage.tsx";

const DEFAULT_CLASSNAME = "dark:text-white text-black";

interface InputProps extends React.ComponentProps<"input"> {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  inside?: boolean;
  leftElementClassName?: string;
  rightElementClassName?: string;
  placeholder?: string;
  label?: string;
  name: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  id?: string;
  mode?: "input" | "textarea";
  ref?: Ref<HTMLInputElement>;
  onBlur?: (ev: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  wrapperClassName?: string;
}

export default function CustomInput({
  className,
  id,
  leftElement,
  rightElement,
  inside = true,
  leftElementClassName = "",
  rightElementClassName = "",
  placeholder,
  label,
  type = "text",
  name,
  errorMessage,
  onChange,
  onBlur,
  defaultValue,
  ref,
  wrapperClassName = "mb-1",
  value,
}: InputProps) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={id} className={``}>
          {label}
        </label>
      )}
      <div className="flex items-center relative">
        {/* Left element positioned outside */}
        {leftElement && !inside && (
          <div className={`flex items-center ${leftElementClassName}`}>
            {leftElement}
          </div>
        )}

        {/* Input container with relative positioning for inside elements */}
        <div className="relative flex-1">
          {/* Left element positioned inside */}
          {leftElement && inside && (
            <div
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 ${leftElementClassName}`}
            >
              {leftElement}
            </div>
          )}

          <Input
            onBlur={onBlur}
            ref={ref as Ref<HTMLInputElement>}
            defaultValue={defaultValue}
            onChange={onChange}
            value={value}
            id={id}
            name={name}
            type={type}
            className={`${className} ${DEFAULT_CLASSNAME} ${leftElement && inside ? "pl-8" : ""} ${rightElement && inside ? "pr-8" : ""} ${
              errorMessage
                ? "border-error focus-visible:ring-error-600 focus-visible:border-error"
                : ""
            }`}
            placeholder={placeholder}
          />

          {/* Right element positioned inside */}
          {rightElement && inside && (
            <div
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 z-10 ${rightElementClassName}`}
            >
              {rightElement}
            </div>
          )}
        </div>

        {/* Right element positioned outside */}
        {rightElement && !inside && (
          <div
            className={`flex items-center ${rightElementClassName} ${errorMessage && "[&_svg]:text-error"}`}
          >
            {rightElement}
          </div>
        )}
      </div>
      {errorMessage && (
        <ErrorMessage
          wrapperClassName="ml-2 text-sm"
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
}
