import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

interface ThemeContextState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextState>({
  theme: "light",
  setTheme: () => {},
  isTransitioning: false,
});

export const ThemeProvider = (props: PropsWithChildren) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    if (newTheme !== theme) {
      setIsTransitioning(true);
      setTimeout(() => {
        setTheme(newTheme);
        setTimeout(() => setIsTransitioning(false), 500); // Wait for CSS transition
      }, 0); // Small delay to start transition
    }
  };

  useEffect(() => {
    document.getElementById("root")?.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleThemeChange, isTransitioning }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
