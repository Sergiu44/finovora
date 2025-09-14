import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCategory } from "../../../../utils/actions/categories";
import { Input } from "../../../../components/ui/input";

export default function EditCategoryDialog({
  category,
  onClose,
}: {
  category: { id: string; name: string };
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["editCategory"],
    mutationFn: ({ name, id }: { name: string; id: string }) => {
      return editCategory(name, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
  });

  const handleEditCategory = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);

    mutate({ name: formData.get("categoryName") as string, id: formData.get("id") as string });
  };
  return (
    <Dialog open={!!category.id} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleEditCategory}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <Input name="id" type="hidden" defaultValue={category.id} />
          <Input className="my-2" name="categoryName" defaultValue={category.name} />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" size="sm" variant="outline">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" size="sm">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
