import { Link } from "@tanstack/react-router";
import type { BaseProps } from "../types/components/BaseProps";
import { useRef, useState, type PropsWithChildren } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { AnimatePresence, motion } from "framer-motion";
import { AnimateChangeInHeight } from "../utils/hoc/AnimateChangeInHeight";

interface IconLinkProps extends PropsWithChildren<BaseProps> {
  icon: React.ReactNode;
  href?: string;
  text: string;
}

export default function IconLink({
  icon,
  className,
  href,
  size,
  text,
  children,
}: IconLinkProps) {
  const [active, setActive] = useState(false);
  return (
    <Link
      to={href}
      activeOptions={{
        exact: true,
      }}
      activeProps={{
        className: "bg-[var(--bg-main)] hover:bg-[var(--bg-main)]",
      }}
      className={`select-none py-3 px-4 hover:bg-[var(--bg-main-light)] rounded-md cursor-pointer items-center gap-2 w-full ${className || ""}`}
    >
      {({ isActive }) => (
        <>
          <div
            onClick={() => setActive(!active)}
            className="flex flex-wrap gap-2 w-full flex-[100%] "
          >
            <span
              className={`${size ? `icon icon-${size}` : "icon"} ${isActive && "text-[var(--white)]"}`}
            >
              {icon}
            </span>
            <div className={size ? `text-${size}` : "text-base"}>{text}</div>
            {children && (
              <ChevronRightIcon
                className={`icon ml-auto transition-discrete ${active ? "rotate-z-[90deg]" : ""}`}
              />
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
