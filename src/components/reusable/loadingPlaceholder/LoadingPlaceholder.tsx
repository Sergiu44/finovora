import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

interface LoadingPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText?: string;
  buttonSubtext?: string;
  onAction?: () => void;
  isActionLoading?: boolean;
  actionDisabled?: boolean;
  floatingIcons?: Array<{
    icon: LucideIcon;
    className?: string;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    animationDelay?: number;
  }>;
  className?: string;
  children?: ReactNode;
}

export function LoadingPlaceholder({
  icon: Icon,
  title,
  description,
  buttonText = "Get Started",
  buttonSubtext,
  onAction,
  isActionLoading = false,
  actionDisabled = false,
  floatingIcons = [],
  className = "",
  children,
}: LoadingPlaceholderProps) {
  const getPositionClasses = (position: string) => {
    switch (position) {
      case "top-left":
        return "top-20 left-20";
      case "top-right":
        return "top-40 right-40";
      case "bottom-left":
        return "bottom-32 left-32";
      case "bottom-right":
        return "bottom-32 right-32";
      default:
        return "top-20 left-20";
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-[70vh] p-8 ${className}`}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="relative"
      >
        {/* Animated rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 200, height: 200, left: -50, top: -50 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{ width: 200, height: 200, left: -50, top: -50 }}
        />

        {/* Main icon container */}
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/30"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="w-12 h-12 text-primary-foreground" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 text-center max-w-md"
      >
        <h1
          className="text-3xl font-bold text-foreground"
          style={{ marginBottom: "6px" }}
        >
          {title}
        </h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </motion.div>

      {(onAction || children) && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center gap-4 mt-6"
        >
          {onAction && (
            <>
              <Button
                onClick={onAction}
                size="lg"
                disabled={isActionLoading || actionDisabled}
                className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <span>{buttonText}</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              {buttonSubtext && (
                <p className="text-xs font-semibold text-muted-foreground">
                  {buttonSubtext}
                </p>
              )}
            </>
          )}
          {children}
        </motion.div>
      )}

      {/* Floating decorative elements */}
      {floatingIcons.map((floatingIcon, index) => {
        const FloatingIconComponent = floatingIcon.icon;
        const positionClasses = getPositionClasses(floatingIcon.position);
        const delay = floatingIcon.animationDelay ?? index * 0.5;

        return (
          <motion.div
            key={index}
            className={`absolute ${positionClasses} ${floatingIcon.className || "text-accent/40"}`}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          >
            <FloatingIconComponent className="w-6 h-6" />
          </motion.div>
        );
      })}
    </div>
  );
}
