import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const systemTheme = useMemo(
    () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    []
  );

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || systemTheme
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const values = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeProvider;
