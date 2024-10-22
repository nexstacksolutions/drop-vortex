// Providers.js
import ThemeProvider from "../contexts/Theme";
import TooltipProvider from "../contexts/Tooltip";
import ProductFormProvider from "../contexts/ProductForm";

const Providers = ({ children }) => {
  return (
    <ThemeProvider>
      <ProductFormProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ProductFormProvider>
    </ThemeProvider>
  );
};

export default Providers;
