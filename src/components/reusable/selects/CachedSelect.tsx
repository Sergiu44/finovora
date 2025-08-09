import { useQuery } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";
import { createEnhancedAxios } from "../../../configs/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

interface ICachedSelectProps {
  entityName: string;
  placeholder?: string;
  name: string;
  errorMessage?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export default function CachedSelect({
  entityName,
  placeholder,
  name,
  errorMessage,
  onChange,
  defaultValue,
}: PropsWithChildren<ICachedSelectProps>) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const { data, isLoading } = useQuery({
    queryKey: [`cached-select-${entityName}`],
    queryFn: async () => {
      const response = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/${entityName}/dropdown`);
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
        <SelectTrigger className="mt-2 text-black">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={`${errorMessage && "input-error"}`}>
          {data?.map((item: any) => (
            <SelectItem className="text-shadow-black" key={item.id} value={item.id.toString()}>
              {item.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errorMessage && (
        <div className="flex gap-1 items-center mt-1.5">
          <ExclamationTriangleIcon className="h-3 w-3 text-error" />
          <p className={`inputError`}>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
