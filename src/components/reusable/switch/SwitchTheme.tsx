import { Moon, Sun } from "lucide-react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../context/ThemeProvider";

export default function SwitchTheme() {
  const { theme, setTheme } = useTheme();

  return createPortal(
    <div className="absolute bottom-4 right-4 shadow-lg p-4 rounded-full bg-white">
      {theme === "dark" ? (
        <Moon onClick={() => setTheme("light")} />
      ) : (
        <Sun onClick={() => setTheme("dark")} />
      )}
    </div>,
    document.body
  );
}
