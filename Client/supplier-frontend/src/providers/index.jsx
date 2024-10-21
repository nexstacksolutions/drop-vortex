// Providers.js
import ThemeProvider from "../contexts/Theme";
import TooltipProvider from "../contexts/Tooltip";

const Providers = ({ children }) => {
  return (
    <ThemeProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
};

export default Providers;
