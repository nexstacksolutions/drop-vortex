// Providers.js
import ThemeProvider from "./context/Theme";
import ProductFormProvider from "./context/ProductForm";

const Providers = ({ children }) => {
  return (
    <ThemeProvider>
      <ProductFormProvider>{children}</ProductFormProvider>
    </ThemeProvider>
  );
};

export default Providers;
