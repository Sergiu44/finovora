import React, { useCallback } from "react";
import type { CardGradientItem } from "../../../../../utils/actions/nomenclatures/defaultGradient";
import { Trash2 } from "lucide-react";

interface IGradientCardProps {
  card: CardGradientItem;
  isSelected: boolean;
  onSelect: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GradientCard({
  card,
  isSelected,
  onSelect,
}: IGradientCardProps) {
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
      onClick={() => onSelect(true)}
    >
      <div className="h-24 rounded-md mb-2" style={getGradientBgStyle()} />
      <div className="text-sm font-medium text-gray-800">{card.name}</div>
      <div className="text-xs text-gray-500">{card.colors.length} colors</div>
      {card.type === "user" && (
        <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity">
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}
