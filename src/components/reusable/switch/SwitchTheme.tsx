import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../context/ThemeProvider";

export default function SwitchTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="rounded-full">
      {theme === "dark" ? (
        <Moon className="h-4 w-4" onClick={() => setTheme("light")} />
      ) : (
        <Sun className="h-4 w-4" onClick={() => setTheme("dark")} />
      )}
    </div>
  );
}
