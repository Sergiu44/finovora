import { useCallback, useState } from "react";
import type { CardGradientItem } from "../../../../../utils/actions/nomenclatures/defaultGradient";
import { useMutation } from "@tanstack/react-query";
import { deleteUserGradientAsync } from "../../../../../utils/actions/users/userGradients";
import { toast } from "sonner";
import ConfirmationModal from "../../../../../components/reusable/dialogs/ConfirmationModal";
import { Trash2 } from "lucide-react";

interface IGradientCardProps {
  card: CardGradientItem;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: (id: number) => void;
}

export default function GradientCard({
  card,
  isSelected,
  onSelect,
  onDelete,
}: IGradientCardProps) {
  const [openDeleteGradientModal, setOpenDeleteGradientModal] = useState(false);

  const { mutate: deleteGradient, isPending } = useMutation({
    mutationKey: ["deleteUserGradient", card.id],
    mutationFn: async (id: number) => {
      const res = await deleteUserGradientAsync(id);
      return res.status;
    },
    onSuccess: (data) => {
      console.log(data);
      onDelete?.(card.id);
      toast.success("Gradient deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete gradient");
      console.error("Error deleting gradient:", error);
    },
  });
  const getGradientBgStyle = useCallback(() => {
    if (card.colors.length === 2) {
      return {
        background: `linear-gradient(135deg, ${card.colors[0]} 0%, ${card.colors[1]} 100%)`,
      };
    } else {
      const colorStops = card.colors.join(", ");
      return {
        background: `linear-gradient(135deg, ${colorStops})`,
      };
    }
  }, [card.colors]);

  return (
    <div
      className={`relative cursor-pointer rounded-lg p-4 transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-2" : "hover:scale-105"
      }`}
      onClick={() => onSelect()}
    >
      <div className="h-24 rounded-md mb-2" style={getGradientBgStyle()} />
      <div className="text-sm font-medium text-gray-800">{card.name}</div>
      <div className="text-xs text-gray-500">{card.colors.length} colors</div>
      {/* Type Badge */}
      <span
        className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full ${
          card.type === "user"
            ? "bg-purple-100 text-purple-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {card.type === "user" ? "Custom" : "Default"}
      </span>

      {/* Delete Button for User Gradients */}

      {card.type === "user" && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDeleteGradientModal(true);
            }}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full"
          >
            <Trash2 size={14} />
          </button>
          <ConfirmationModal
            data={card.id}
            mutation={deleteGradient}
            loading={isPending}
            setOpen={setOpenDeleteGradientModal}
            open={openDeleteGradientModal}
            revalidateKeys={{ queryKey: ["userGradients"] }}
          />
        </>
      )}
    </div>
  );
}
