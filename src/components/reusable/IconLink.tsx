import { Link } from "@tanstack/react-router";
import type { BaseProps } from "../../types/components/BaseProps";
import { useState } from "react";

interface IconLinkProps extends BaseProps {
  icon: React.ReactNode;
  href?: string;
  text: string;
  variant?: "default" | "slim";
}

export default function IconLink({
  icon,
  className,
  href,
  size,
  text,
  variant = "default",
}: IconLinkProps) {
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
              className:
                "bg-primary hover:bg-primary/90! text-white! transition-all ease-in-out duration-500",
            }
          : {
              className:
                "bg-primary-300 hover:bg-primary! text-white! transition-all ease-in-out duration-500",
            }
      }
      className={`group text-muted-foreground hover:text-foreground font-medium select-none py-1.5 px-4 rounded-[8px] cursor-pointer items-center gap-2 w-full dark:text-muted-foreground ${className || ""} ${variant === "slim" ? "font-medium py-1.5! px-3! rounded-[16px]! hover:bg-primary/10" : "hover:bg-gray-100 dark:hover:text-white"}`}
    >
      {({ isActive }) => (
          <div
            onClick={() => setActive(!active)}
            className="flex items-center gap-2 w-full flex-[100%] whitespace-nowrap"
          >
            <span
              className={`${variant === "slim" ? "hidden lg:block h-3 w-3" : "h-4 w-4"} ${isActive && "text-white"}`}
            >
              {icon}
            </span>
            <div
              className={
                size
                  ? `text-${size}`
                  : `${variant === "slim" ? "text-sm" : "text-xs lg:text-base"}`
              }
            >
              {text}
            </div>
          </div>
      )}
    </Link>
  );
}
