// Providers.js
import ThemeProvider from "./context/Theme";
import TooltipProvider from "./context/Tooltip";
import ProductFormProvider from "./context/ProductForm";

const Providers = ({ children }) => {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <ProductFormProvider>{children}</ProductFormProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default Providers;
