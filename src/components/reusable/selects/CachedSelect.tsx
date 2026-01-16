import { useQuery } from "@tanstack/react-query";
import { useMemo, type PropsWithChildren } from "react";
import { createEnhancedAxios } from "../../../configs/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import ErrorMessage from "../errorMessages/errorMessage";

interface ICachedSelectProps {
  entityName: string;
  placeholder?: string;
  name: string;
  errorMessage?: string;
  onChange: (value: string) => void;
  value?: string;
  className?: string;
  params?: Record<string, string>;
  omitIds?: string[];
  disabled?: boolean;
  noOptionsMessage?: string;
}

export default function CachedSelect({
  entityName,
  placeholder,
  name,
  errorMessage,
  onChange,
  value,
  className,
  params,
  omitIds,
  disabled,
  noOptionsMessage,
}: PropsWithChildren<ICachedSelectProps>) {
  const { data, isLoading } = useQuery({
    queryKey: [`cached-select-${entityName}`, params],
    queryFn: async () => {
      const response = await createEnhancedAxios().get(
        `${import.meta.env.VITE_API_URL}/${entityName}/dropdown`,
        {
          params,
        }
      );
      return response.data;
    },
  });

  const filteredData = useMemo(() => {
    return omitIds && omitIds.length > 0
      ? data?.filter((item: any) => !omitIds.includes(item.id.toString()))
      : data;
  }, [data, omitIds]);

  const hasNoOptions = !filteredData || filteredData.length === 0;
  const isDisabled = disabled || hasNoOptions;

  if (isLoading) {
    return (
      <div>
        <div
          className={`h-[40px]! ${className} mt-2 flex items-center justify-between rounded-md border border-input bg-muted/50 px-3 py-2 text-sm animate-pulse`}
        >
          <span className="text-muted-foreground/50">
            {placeholder || "Loading..."}
          </span>
          <svg
            className="h-4 w-4 animate-spin text-muted-foreground/50"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
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

  return (
    <div>
      <Select
        onValueChange={(e) => {
          onChange(e);
        }}
        value={value}
        name={name}
        disabled={isDisabled}
      >
        <SelectTrigger
          disabled={disabled}
          className={`h-[40px]! ${className} mt-2 data-[placeholder]:text-muted-foreground/80! text-black ${errorMessage && "border-error! focus-visible:ring-error-600! focus-visible:border-error!"}`}
        >
          {hasNoOptions && noOptionsMessage && !value ? (
            <span className="text-muted-foreground/40">{noOptionsMessage}</span>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent className={`${errorMessage && "input-error"}`}>
          {filteredData?.map((item: any) => (
            <SelectItem
              className="text-shadow-black rounded-[8px]! pl-3"
              key={item.id}
              value={item.id.toString()}
            >
              {item.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errorMessage && (
        <ErrorMessage
          wrapperClassName="ml-2 text-sm"
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
}
