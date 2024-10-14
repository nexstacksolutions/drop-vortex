// Providers.js
import ThemeProvider from "./context/ThemeContext";
import ProductFormProvider from "./context/ProductForm";
import { ProductFormStateProvider } from "./context/ProductFormState";
import { ProductFormUIProvider } from "./context/ProductFormUI";

const Providers = ({ children }) => {
  return (
    <ThemeProvider>
      <ProductFormProvider>
        <ProductFormStateProvider>
          <ProductFormUIProvider>{children}</ProductFormUIProvider>
        </ProductFormStateProvider>
      </ProductFormProvider>
    </ThemeProvider>
  );
};

export default Providers;
