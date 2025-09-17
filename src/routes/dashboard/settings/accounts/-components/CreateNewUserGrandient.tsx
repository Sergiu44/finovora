import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../../../../components/ui/dialog";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";
import { useValidation } from "../../../../../utils/hooks/useValidation/useValidation";
import VALIDATIONS from "../../../../../utils/hooks/useValidation";
import Validator from "../../../../../utils/hooks/useValidation/Validator";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  createUserGradientAsync,
  type UserGradientItem,
} from "../../../../../utils/actions/users/userGradients";

interface ICreateNewUserGrandientProps {
  onSuccess: (data: UserGradientItem) => void;
}

export default function CreateNewUserGrandient(
  props: ICreateNewUserGrandientProps
) {
  const { values, errors, onChangeInput, handleCheckFormErrors } =
    useValidation(
      new Validator()
        .forProperty("name")
        .check(VALIDATIONS.isRequired, "Name is required")
        .check(VALIDATIONS.minLength(3), "Name must be at least 3 characters")
        .forProperty("slug")
        .check(VALIDATIONS.isRequired, "Slug is required")
        .check(VALIDATIONS.minLength(3), "Slug must be at least 3 characters")
        .forProperty("color1", "#000000")
        .check(VALIDATIONS.isRequired, "First color is required")
        .forProperty("color2", "#000000")
        .check(VALIDATIONS.isRequired, "Second color is required")
        .applyCheckOnlyOnSubmit()
    );

  const { mutate, isPending } = useMutation({
    mutationKey: ["createUserGradient"],
    mutationFn: (userGradient: Omit<UserGradientItem, "id">) => {
      return createUserGradientAsync(userGradient);
    },
    onSuccess: (data) => {
      props.onSuccess(data.item);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (handleCheckFormErrors()) {
      return;
    }

    mutate({
      from: values.color1,
      to: values.color2,
      name: values.name,
      slug: values.slug,
    });
  };

  const gradientStyle = {
    background: `linear-gradient(45deg, ${values.color1}, ${values.color2})`,
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`group relative cursor-pointer rounded-lg p-4 transition-all duration-200`}
        >
          <div className="h-24 rounded-md mb-2 border border-muted-foreground/25 hover:border-muted-foreground border-dashed grid place-items-center">
            <Plus className="w-4 h-4 text-gray-500 group-hover:text-gray-800" />
          </div>
          <div className="text-sm font-medium text-gray-800">
            Create new card gradient
          </div>
          <div className="text-xs text-gray-500">Only 2 colors</div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new card gradient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview Card */}
          <div className="relative cursor-pointer rounded-lg p-4 transition-all duration-200">
            <div className="h-24 rounded-md mb-2" style={gradientStyle} />
            <div className="text-sm font-medium text-gray-800">
              {values.name || "New Gradient"}
            </div>
            <div className="text-xs text-gray-500">2 colors</div>
          </div>

          {/* Color Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color1">First Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="color1"
                  name="color1"
                  value={values.color1}
                  onChange={onChangeInput}
                  className="h-10 w-full"
                />
              </div>
              {errors.color1 && (
                <p className="text-sm text-red-500">{errors.color1}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="color2">Second Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="color2"
                  name="color2"
                  value={values.color2}
                  onChange={onChangeInput}
                  className="h-10 w-full"
                />
              </div>
              {errors.color2 && (
                <p className="text-sm text-red-500">{errors.color2}</p>
              )}
            </div>
          </div>

          {/* Name and Slug Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter gradient name"
                value={values.name}
                onChange={onChangeInput}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                type="text"
                id="slug"
                name="slug"
                placeholder="Enter gradient slug"
                value={values.slug}
                onChange={onChangeInput}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Gradient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
