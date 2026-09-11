import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../../../components/ui/button";
import { type CardGradientItem } from "../../../../../utils/actions/nomenclatures/defaultGradient";
import { motion } from "framer-motion";
import { SendIcon } from "lucide-react";

interface IAccountPreviewCardProps {
  name?: string;
  description?: string;
  accountType?: string;
  amount: number;
  currency: string;
  gradient?: CardGradientItem;
  wrapperClassName?: string;
  onClick?: () => void;
  isRemoving?: boolean;
  icons?: React.ReactNode[];
}

export default function AccountPreviewCard({
  name,
  description,
  amount,
  currency,
  accountType,
  gradient,
  wrapperClassName,
  onClick,
  isRemoving = false,
  icons,
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
        className="rounded-lg py-8 px-12 text-white shadow-sm"
        style={getGradientBgStyle()}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between">
            <div>
              <span className="uppercase opacity-60">Current Balance</span>
              <h3 className="text-2xl font-bold mt-2">
                {name || "- Card Name -"}
              </h3>
              <p className="opacity-60">{description || "- Description -"}</p>
            </div>
            <div className="flex gap-3">
              {icons && icons.map((icon) => icon)}
            </div>
          </div>
          <div className="my-8 text-5xl">
            {amount} <span className="text-white/60 text-xl">{currency}</span>
          </div>
          <div className="flex gap-4">
            <Button variant="pure" size="xl">
              <PlusIcon />
              Add Transaction
            </Button>
            <Button
              variant="none"
              size="xl"
              className="bg-white/10 !rounded-full"
            >
              <SendIcon />
              Transfer
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
