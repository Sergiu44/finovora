import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/16/solid";

interface EmptyCardProps {
  text?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
  onClick?: () => void;
}

export default function EmptyCard({
  text,
  icon,
  wrapperClassName,
  onClick,
}: EmptyCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`w-full mx-auto ${wrapperClassName}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="rounded-base p-6 text-muted-foreground h-[200px] border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
        <div className="text-center">
          {icon || <PlusIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />}
          <p className="text-sm">{text || "Select an account to continue"}</p>
        </div>
      </div>
    </motion.div>
  );
}
