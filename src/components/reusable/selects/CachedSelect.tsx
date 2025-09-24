import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type PropsWithChildren } from "react";
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
  defaultValue?: string;
  className?: string;
  params?: Record<string, string>;
  omitIds?: string[];
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
  omitIds,
}: PropsWithChildren<ICachedSelectProps>) {
  const [value, setValue] = useState<string | undefined>(defaultValue);
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

  return (
    <div>
      <Select
        onValueChange={(e) => {
          setValue(e);
          onChange(e);
        }}
        value={value}
        name={name}
        disabled={isLoading}
      >
        <SelectTrigger
          className={`${className} mt-2 data-[placeholder]:text-muted-foreground! ${errorMessage && "border-error! focus-visible:ring-error-600! focus-visible:border-error!"}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={`${errorMessage && "input-error"}`}>
          {filteredData?.map((item: any) => (
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
        <ErrorMessage
          wrapperClassName="ml-2 text-sm"
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
}
