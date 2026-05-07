import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/16/solid";
import type { PropsWithChildren } from "react";

interface EmptyCardProps {
  text?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
  onClick?: () => void;
}

function EmptyCardRoot({
  children,
  wrapperClassName,
  onClick,
}: PropsWithChildren<Pick<EmptyCardProps, "onClick" | "wrapperClassName">>) {
  return (
    <motion.div
      onClick={onClick}
      className={`w-full mx-auto h-[200px] ${wrapperClassName}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex h-full items-center justify-center rounded-base text-center p-6 text-muted-foreground border-2 border-dashed border-muted-foreground/25">
        {children || (
          <>
            <EmptyCard.Icon />
            <EmptyCard.Title />
          </>
        )}
      </div>
    </motion.div>
  );
}

function EmptyCardIcon({ icon }: Pick<EmptyCardProps, "icon">) {
  return icon || <PlusIcon className="w-6 h-6 opacity-50" />;
}

function EmptyCardTitle({ text }: Pick<EmptyCardProps, "text">) {
  return <p className="text-sm">{text || "Select an account to continue"}</p>;
}

const EmptyCard = {
  Root: EmptyCardRoot,
  Icon: EmptyCardIcon,
  Title: EmptyCardTitle,
};

export default EmptyCard;
