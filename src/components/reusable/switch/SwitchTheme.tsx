import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../context/ThemeProvider";

export default function SwitchTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="rounded-full">
      {theme === "dark" ? (
        <Moon onClick={() => setTheme("light")} />
      ) : (
        <Sun onClick={() => setTheme("dark")} />
      )}
    </div>
  );
}
