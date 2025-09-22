import { type CardGradientItem } from "../../../../../utils/actions/nomenclatures/defaultGradient";
import { motion } from "framer-motion";

interface IAccountPreviewCardProps {
  name?: string;
  description?: string;
  accountType?: string;
  currency?: string;
  gradient?: CardGradientItem;
  wrapperClassName?: string;
  onClick?: () => void;
  isRemoving?: boolean;
}

export default function AccountPreviewCard({
  name,
  description,
  accountType,
  currency,
  gradient,
  wrapperClassName,
  onClick,
  isRemoving = false,
}: IAccountPreviewCardProps) {
  const getGradientBgStyle = () => {
    if (!gradient) return { background: "#f3f4f6" };

    if (gradient.colors.length === 2) {
      return {
        background: `linear-gradient(135deg, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 100%)`,
      };
    } else {
      const colorStops = gradient.colors.join(", ");
      return {
        background: `linear-gradient(135deg, ${colorStops})`,
      };
    }
  };

  return (
    <motion.div
      onClick={onClick}
      className={`w-full mx-auto ${wrapperClassName}`}
      animate={
        isRemoving ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }
      }
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div
        className="rounded-lg p-6 text-white shadow-lg h-[200px]"
        style={getGradientBgStyle()}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-2xl font-bold">{name || "- Card Name -"}</h3>
            <p className="text-sm opacity-90">
              {description || "- Description -"}
            </p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="opacity-75">Account Type</p>
              <p className="font-medium">{accountType || "- Type -"}</p>
            </div>
            <div className="text-right">
              <p className="opacity-75">Currency</p>
              <p className="font-medium">{currency || "- Currency -"}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
