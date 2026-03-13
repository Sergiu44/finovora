import { useRouter } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Button } from "../../components/ui/button";

export default function Header() {
  const router = useRouter();
  const { scrollY } = useScroll();

  // Map the first 75px of scroll to a normalized progress value
  const scrollWindow = useTransform(scrollY, [0, 150], [0, 1], { clamp: true });

  const scaleX = useSpring(useTransform(scrollWindow, [0, 1], [1, 0.98]), {
    stiffness: 360,
    damping: 32,
    mass: 0.45,
  });
  const borderRadius = useSpring(useTransform(scrollWindow, [0, 1], [0, 12]), {
    stiffness: 320,
    damping: 28,
    mass: 0.4,
  });
  const paddingY = useSpring(useTransform(scrollWindow, [0, 1], [12, 6]), {
    stiffness: 380,
    damping: 30,
    mass: 0.5,
  });
  const paddingX = useSpring(useTransform(scrollWindow, [0, 1], [40, 22]), {
    stiffness: 380,
    damping: 30,
    mass: 0.5,
  });
  const backgroundColor = useTransform(
    scrollWindow,
    [0, 1],
    [
      "rgba(255, 255, 255, 0.72)",
      "color-mix(in oklch, var(--primary) 80%, transparent)",
    ]
  );
  const topOffset = useTransform(scrollWindow, [0, 1], ["0rem", "0.5rem"]);

  return (
    <motion.div
      style={{
        position: "sticky",
        top: topOffset,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
      }}
    >
      <motion.div
        initial={false}
        style={{ overflow: "hidden", originY: "top" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <motion.header
          style={{
            margin: "0 auto",
            scaleX,
            borderRadius,
            paddingTop: paddingY,
            paddingBottom: paddingY,
            paddingLeft: paddingX,
            paddingRight: paddingX,
            transformOrigin: "center center",
            backgroundColor,
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(15, 23, 42, 0.08)",
          }}
          className="flex justify-between items-center"
        >
          <h3 style={{ margin: 0 }}>Finovora</h3>
          <nav aria-label="Primary navigation">
            <ul
              style={{
                display: "flex",
                gap: "1.5rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
                fontWeight: 500,
              }}
            >
              <li style={{ cursor: "pointer" }}>Features</li>
              <li style={{ cursor: "pointer" }}>About</li>
              <li style={{ cursor: "pointer" }}>Pricing</li>
            </ul>
          </nav>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="ghost"
              onClick={() => router.navigate({ to: "/auth/login" })}
            >
              Sign In
            </Button>
            <Button onClick={() => router.navigate({ to: "/auth/register" })}>
              Get Started
            </Button>
          </div>
        </motion.header>
      </motion.div>
    </motion.div>
  );
}
