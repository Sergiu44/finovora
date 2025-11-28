import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/16/solid";

interface EmptyAccountCardProps {
  wrapperClassName?: string;
  onClick?: () => void;
}

export default function EmptyAccountCard({
  wrapperClassName,
  onClick,
}: EmptyAccountCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`w-full mx-auto ${wrapperClassName}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="rounded-base p-6 text-muted-foreground bg-muted/50 shadow-lg h-[200px] border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
        <div className="text-center">
          <PlusIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select an account to continue</p>
        </div>
      </div>
    </motion.div>
  );
}
