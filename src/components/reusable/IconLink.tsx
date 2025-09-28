import { Link } from "@tanstack/react-router";
import type { BaseProps } from "../../types/components/BaseProps";
import { useState, type PropsWithChildren } from "react";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { AnimatePresence, motion } from "framer-motion";
import { AnimateChangeInHeight } from "../../utils/hoc/AnimateChangeInHeight";

interface IconLinkProps extends PropsWithChildren<BaseProps> {
  icon: React.ReactNode;
  href?: string;
  text: string;
  variant?: "default" | "slim";
}

export default function IconLink({ icon, className, href, size, text, children, variant = "default" }: IconLinkProps) {
  const [active, setActive] = useState(false);
  return (
    <Link
      to={href}
      activeOptions={{
        exact: href === "/dashboard",
      }}
      activeProps={
        variant === "default"
          ? {
              className: "bg-primary hover:bg-primary/90 text-white transition-all ease-in-out duration-500",
            }
          : {
              className: "bg-primary/50 hover:bg-primary/30 text-white transition-all ease-in-out duration-500",
            }
      }
      className={`group select-none py-3 px-4 rounded-[32px] cursor-pointer items-center gap-2 w-full ${className || ""} ${variant === "slim" ? "py-1! px-2! rounded-[12px]! hover:bg-primary/30 hover:text-white" : "hover:outline-2 hover:outline-primary"}`}
    >
      {({ isActive }) => (
        <>
          <div onClick={() => setActive(!active)} className="flex flex-wrap items-center gap-2 w-full flex-[100%] ">
            <span
              className={`${variant === "slim" ? "h-3 w-3" : "h-4 w-4"} text-bg-main-hover ${isActive && "text-white"}`}
            >
              {icon}
            </span>
            <div className={size ? `text-${size}` : "text-base"}>{text}</div>
            {children && (
              <ChevronRightIcon className={`ml-auto transition-discrete ${active ? "rotate-z-[90deg]" : ""}`} />
            )}
          </div>
          {children && (
            <AnimatePresence>
              <AnimateChangeInHeight>
                {active && (
                  <motion.div
                    transition={{
                      delay: 0.1,
                      duration: 0.2,
                    }}
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                  >
                    <div>{children}</div>
                  </motion.div>
                )}
              </AnimateChangeInHeight>
            </AnimatePresence>
          )}
        </>
      )}
    </Link>
  );
}
