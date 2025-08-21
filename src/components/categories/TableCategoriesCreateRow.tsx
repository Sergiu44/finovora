import { PlusIcon } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import CustomInput from "../reusable/inputs/Input";
import { Button } from "../ui/button";
import { TableRow, TableCell } from "../ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreateCategory, createCategory } from "../../actions/categories";
import Validator from "../../hooks/useValidation/Validator";
import VALIDATIONS from "../../utils/hooks/useValidation";
import { useValidation } from "../../hooks/useValidation/useValidation";

const validator = new Validator().forProperty("name").check(VALIDATIONS.isRequired, "Name is required");

export default function TableCategoriesCreateRow({
  columns,
  parentCategoryId,
}: {
  columns: any[];
  parentCategoryId?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { errors, onChangeInput, values } = useValidation(validator);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: (data: CreateCategory) => {
      return createCategory(data, parentCategoryId);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsCreating(false);
    },
  });
  const handleCreateCategory = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    mutate({
      name: values["name"] as string,
      parentCategoryId: undefined,
    });
  };

  useEffect(() => {
    if (isCreating && formRef.current) {
      formRef.current.getElementsByTagName("input")[0]?.focus();
    }
  }, [isCreating]);

  useLayoutEffect(() => {
    const toggleCreating = (ev: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(ev.target as Node)) {
        setIsCreating(false);
      }
    };
    window.addEventListener("mousedown", toggleCreating);

    return () => {
      window.removeEventListener("mousedown", toggleCreating);
    };
  }, []);

  return (
    <TableRow>
      <TableCell className={`m-0 py-2 ${parentCategoryId ? "px-6" : "px-2"}`} colSpan={columns.length}>
        {isCreating ? (
          <form onSubmit={handleCreateCategory} ref={formRef}>
            <div className="relative">
              <CustomInput
                type="text"
                mode="input"
                onChange={(ev) => onChangeInput(ev as React.ChangeEvent<HTMLInputElement>)}
                value={(values["name"] || "") as string}
                name="name"
                rightElement={
                  <Button
                    type="submit"
                    disabled={!!errors["name"] || values["name"] === ""}
                    className="h-[28px] px-3 rounded-xl"
                  >
                    Save
                  </Button>
                }
                placeholder="Create a new (sub)category"
              />
            </div>
          </form>
        ) : (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full flex gap-1 items-center justify-start"
            variant="ghost"
          >
            <PlusIcon />
            Create
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
