import { createFileRoute, Outlet } from "@tanstack/react-router";
import Logo from "../../components/reusable/utils/Logo";
import { useTheme } from "../../context/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/auth/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
      <div className="relative col-span-5 m-6 mr-0">
        <div className="flex justify-between items-center my-auto w-5/7 mx-auto h-[100px] z-10">
          <Logo />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {theme !== "dark" && (
            <motion.div
              key="light-card"
              layoutId="authCard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-lg bg-border"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="relative col-span-7 grid place-content-center h-[calc(100% - 1.5rem)] m-6 ml-0">
        <div className="relative text-black z-10">
          <Outlet />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" && (
            <motion.div
              key="dark-card"
              layoutId="authCard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-lg bg-card"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
