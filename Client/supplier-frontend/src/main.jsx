import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import ThemeProvider from "./context/ThemeContext";
import ProductFormProvider from "./context/ProductForm";

// Render the app with routing support
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ProductFormProvider>
        <RouterProvider router={router} />
      </ProductFormProvider>
    </ThemeProvider>
  </StrictMode>
);
