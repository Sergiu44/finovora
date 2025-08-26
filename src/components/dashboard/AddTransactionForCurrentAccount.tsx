import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import CachedSelect from "../../components/reusable/selects/CachedSelect";
import { useUserMainAccount } from "../../context/UserMainAccount";
import { useValidation } from "../../utils/hooks/useValidation/useValidation";
import Validator from "../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../utils/hooks/useValidation/index";
import { TransactionTypes } from "../../types/enums/TransactionTypes";
import { getCategories } from "../../actions/categories";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";

interface IAddTransactionForCurrentAccount {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddTransactionForCurrentAccount(props: IAddTransactionForCurrentAccount) {
  const { account } = useUserMainAccount();
  const [transactionType, setTransactionType] = useState<TransactionTypes>(TransactionTypes.EXPENSE);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  // Form validation
  const { values, errors, onChangeInput, onChangeValue, handleCheckFormErrors } = useValidation(
    new Validator()
      .forProperty("amount")
      .check(VALIDATIONS.isRequired, "Amount is required.")
      .check((value: string) => !isNaN(Number(value)) && Number(value) > 0, "Amount must be a positive number.")
      .forProperty("description")
      .check(VALIDATIONS.isRequired, "Description is required.")
      .check(VALIDATIONS.minLength(3), "Description must be at least 3 characters.")
      .forProperty("categoryId")
      .check(VALIDATIONS.isRequired, "Category is required.")
      .forProperty("date")
      .check(VALIDATIONS.isRequired, "Date is required.")
      .forProperty("tags")
      .forProperty("notes")
      .applyCheckOnlyOnSubmit()
  );

  // Fetch categories based on transaction type
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", transactionType],
    queryFn: () => getCategories(transactionType),
    enabled: !!transactionType,
  });

  // Get selected category's subcategories
  const selectedCategoryData = categories?.find((cat) => cat.id.toString() === selectedCategory);
  const subCategories = selectedCategoryData?.subCategories || [];

  // Handle form submission
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (handleCheckFormErrors()) {
      return;
    }

    const formData = new FormData(ev.currentTarget);
    const transactionData = {
      accountId: account?.id,
      transactionTypeId: transactionType,
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
      categoryId: Number(formData.get("categoryId")),
      subCategoryId: formData.get("subCategoryId") ? Number(formData.get("subCategoryId")) : null,
      date: formData.get("date") as string,
      tags: formData.get("tags") as string,
      notes: formData.get("notes") as string,
    };

    console.log("Transaction data:", transactionData);
    // TODO: Implement transaction creation API call
    props.setOpen(false);
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (props.open) {
      setTransactionType(TransactionTypes.EXPENSE);
      setSelectedCategory("");
      setSelectedSubCategory("");
    }
  }, [props.open]);

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="min-w-7xl">
        <DialogTitle className="text-xl font-semibold">Add Transaction</DialogTitle>
        <DialogDescription className="mb-6">
          <p>Add a new transaction for {account?.name || "your account"}.</p>
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount</Label>
                <div className="flex items-center relative">
                  <Input
                    name="amount"
                    type="number"
                    value={values.amount}
                    onChange={onChangeInput}
                    className="w-full pl-9"
                  />
                  {errors.amount && <span>{errors.amount}</span>}
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <CachedSelect
                  entityName="categories"
                  placeholder={categoriesLoading ? "Loading categories..." : "Select a category"}
                  name="categoryId"
                  errorMessage={errors.categoryId}
                  onChange={(value) => {
                    onChangeValue("categoryId", value);
                    setSelectedCategory(value);
                    setSelectedSubCategory("");
                  }}
                  defaultValue={selectedCategory}
                />
              </div>

              {/* Subcategory Selection (if available) */}
              {subCategories.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Subcategory (Optional)</Label>
                  <CachedSelect
                    entityName="categories"
                    placeholder="Select a subcategory"
                    name="subCategoryId"
                    onChange={(value) => {
                      onChangeValue("subCategoryId", value);
                      setSelectedSubCategory(value);
                    }}
                    defaultValue={selectedSubCategory}
                  />
                </div>
              )}

              {/* Date */}
              <div className="space-y-2">
                <Input
                  name="date"
                  type="date"
                  value={values.date || new Date().toISOString().split("T")[0]}
                  onChange={onChangeInput}
                  className="w-full"
                />
                {errors.date && <span>{errors.date}</span>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Description */}
              <div className="space-y-2">
                <Input
                  name="description"
                  placeholder="Enter transaction description"
                  value={values.description}
                  onChange={onChangeInput}
                  className="w-full"
                />
                {errors.description && <span>{errors.description}</span>}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Input
                  name="tags"
                  placeholder="Enter tags separated by commas"
                  value={values.tags}
                  onChange={onChangeInput}
                  className="w-full"
                />
                {errors.tags && <span>{errors.tags}</span>}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Input
                  name="notes"
                  placeholder="Add any additional notes"
                  value={values.notes}
                  onChange={onChangeInput}
                  className="w-full"
                />
                {errors.notes && <span>{errors.notes}</span>}
              </div>
            </div>
          </div>

          {/* Form Actions - Full Width */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => props.setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
