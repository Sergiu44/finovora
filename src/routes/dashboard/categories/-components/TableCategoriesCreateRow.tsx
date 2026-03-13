import { PlusIcon, CornerDownRight } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { TableRow, TableCell } from "../../../../components/ui/table";
import VALIDATIONS from "../../../../utils/hooks/useValidation";
import { Input } from "../../../../components/ui/input";
import {
  type CreateCategory,
  createCategory,
  editCategory,
} from "../../../../utils/actions/categories";
import { useValidation } from "../../../../utils/hooks/useValidation/useValidation";
import Validator from "../../../../utils/hooks/useValidation/Validator";
import useCreateEditMutation from "../../../../utils/hooks/useCreateEditMutation/useCreateEditMutation";

export default function TableCategoriesCreateRow({
  columns,
  parentCategoryId,
  transactionTypeId,
  isEditing = false,
  categoryName = undefined,
  categoryId = undefined,
}: {
  columns: unknown[];
  parentCategoryId?: number;
  transactionTypeId: number;
  isEditing?: boolean;
  categoryName?: string;
  categoryId?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isCreating, setIsCreating] = useState(isEditing);

  const validator = new Validator()
    .forProperty("name", categoryName)
    .check(VALIDATIONS.isRequired, "Name is required");

  const { errors, onChangeInput, values, onChangeValue } =
    useValidation(validator);

  const editCreateCategory = useCreateEditMutation<CreateCategory>({
    basePath: "categories",
    createFn: createCategory,
    editFn: editCategory,
    id: categoryId ? categoryId : undefined,
  });

  const handleCreateCategory = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    onChangeValue("name", "");

    if (categoryId) {
      editCreateCategory({
        id: categoryId as string,
        name: values["name"] as string,
        parentCategoryId,
        transactionTypeId,
      });
    } else {
      editCreateCategory({
        id: categoryId as string,
        name: values["name"] as string,
        parentCategoryId,
        transactionTypeId,
      });
    }
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
        onChangeValue("name", "");
      }
    };
    window.addEventListener("mousedown", toggleCreating);

    return () => {
      window.removeEventListener("mousedown", toggleCreating);
    };
  }, [onChangeValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCreating(false);
        onChangeValue("name", "");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onChangeValue]);

  return (
    <TableRow className={`select-none`}>
      <TableCell className={`m-0 py-2 px-2`} colSpan={columns.length}>
        {isCreating ? (
          <form onSubmit={handleCreateCategory} ref={formRef}>
            <div className="relative">
              <Input
                type="text"
                onChange={(ev) =>
                  onChangeInput(ev as React.ChangeEvent<HTMLInputElement>)
                }
                value={(values["name"] || "") as string}
                name="name"
                placeholder={`Create a new ${parentCategoryId ? "sub" : ""}category`}
              />
              <Button
                type="submit"
                disabled={!!errors["name"] || values["name"] === ""}
                className="h-[28px] px-3 rounded-xl absolute right-2 z-10 top-1"
              >
                Save
              </Button>
            </div>
          </form>
        ) : (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full flex gap-1 items-center justify-start"
            variant="ghost"
          >
            {parentCategoryId && (
              <CornerDownRight className="h-3.5 w-3.5 text-muted-foreground mr-3" />
            )}
            <PlusIcon />
            {parentCategoryId ? "Create subcategory" : "Create"}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
