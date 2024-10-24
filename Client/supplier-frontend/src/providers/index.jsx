// Providers.js
import ThemeProvider from "../contexts/Theme";
import ProductFormProvider from "../contexts/ProductForm";

const Providers = ({ children }) => {
  return (
    <ThemeProvider>
      <ProductFormProvider>{children}</ProductFormProvider>
    </ThemeProvider>
  );
};

export default Providers;
