import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Button } from "../../../../components/ui/button";
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

// Wrapper to match the expected signature for useCreateEditMutation
const editCategoryWrapper = (data: { name: string; id: string }) => {
  return editCategory(data.name, data.id);
};

interface CategoryNameInputProps {
  initialValue?: string;
  categoryId?: string;
  parentCategoryId?: number;
  transactionTypeId: number;
  placeholder?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  className?: string;
}

export default function CategoryNameInput({
  initialValue = "",
  categoryId,
  parentCategoryId,
  transactionTypeId,
  placeholder,
  onCancel,
  onSuccess,
  className = "",
}: CategoryNameInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validator = new Validator()
    .forProperty("name", initialValue)
    .check(VALIDATIONS.isRequired, "Name is required");

  const { errors, onChangeInput, values, onChangeValue } =
    useValidation(validator);

  const editCreateCategory = useCreateEditMutation<CreateCategory>({
    basePath: "categories",
    createFn: createCategory,
    editFn: editCategoryWrapper,
    id: categoryId ? categoryId : undefined,
  });

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const name = (values["name"] || "").toString().trim();
    if (!name) return;

    if (categoryId) {
      // Editing existing category - only need name and id
      editCreateCategory({
        id: categoryId,
        name,
      } as CreateCategory & { id: string });
    } else {
      // Creating new category
      editCreateCategory({
        name,
        parentCategoryId,
        transactionTypeId,
      } as CreateCategory & { id: string });
    }

    onChangeValue("name", "");
    onSuccess?.();
  };

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  // Handle click outside to cancel
  useLayoutEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(ev.target as Node)) {
        onChangeValue("name", "");
        onCancel?.();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onChangeValue, onCancel]);

  // Handle Escape key to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onChangeValue("name", "");
        onCancel?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onChangeValue, onCancel]);

  return (
    <form onSubmit={handleSubmit} ref={formRef} className={className}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          onChange={(ev) =>
            onChangeInput(ev as React.ChangeEvent<HTMLInputElement>)
          }
          value={
            (values["name"] !== undefined
              ? values["name"]
              : initialValue || "") as string
          }
          name="name"
          placeholder={placeholder}
          className="pr-20"
        />
        <Button
          type="submit"
          disabled={
            !!errors["name"] ||
            !values["name"] ||
            (values["name"] as string).trim() === ""
          }
          className="h-[28px] px-3 rounded-xl absolute right-2 z-10 top-1"
          size="sm"
        >
          Save
        </Button>
      </div>
    </form>
  );
}
