import { useQuery } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";
import { createEnhancedAxios } from "../../../configs/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import ErrorMessage from "../errorMessages/errorMessage";

interface ICachedSelectProps {
  entityName: string;
  placeholder?: string;
  name: string;
  errorMessage?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  className?: string;
  params?: Record<string, string>;
}

export default function CachedSelect({
  entityName,
  placeholder,
  name,
  errorMessage,
  onChange,
  defaultValue,
  className,
  params,
}: PropsWithChildren<ICachedSelectProps>) {
  const [value, setValue] = useState<string | undefined>(undefined);
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

  return (
    <div>
      <Select
        onValueChange={(e) => {
          setValue(e);
          onChange(e);
        }}
        value={value || defaultValue?.toString()}
        name={name}
        disabled={isLoading}
      >
        <SelectTrigger
          className={`${className} mt-2 data-[placeholder]:text-muted-foreground!`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={`${errorMessage && "input-error"}`}>
          {data?.map((item: any) => (
            <SelectItem
              className="text-shadow-black"
              key={item.id}
              value={item.id.toString()}
            >
              {item.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errorMessage && (
        <ErrorMessage wrapperClassName="ml-2" errorMessage={errorMessage} />
      )}
    </div>
  );
}
