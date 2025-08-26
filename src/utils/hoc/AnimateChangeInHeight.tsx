import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { motion } from "framer-motion";

interface AnimateChangeInHeightProps extends PropsWithChildren {
  className?: string;
}

export const AnimateChangeInHeight: React.FC<AnimateChangeInHeightProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const observedHeight = entries[0].contentRect.height;
        setHeight(observedHeight);
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  });

  return (
    <motion.div
      className={`${className} overflow-hidden`}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.25 }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
};
