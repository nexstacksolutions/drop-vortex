// Providers.js
import ThemeProvider from "../contexts/Theme";
import TooltipProvider from "../contexts/Tooltip";
import ProductFormProvider from "../contexts/ProductForm";

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
