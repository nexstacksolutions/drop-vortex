import { createContext, useContext, useReducer, useMemo } from "react";
import { ProductFormStateProvider } from "./ProductFormState";
import { ProductFormUIProvider } from "./ProductFormUI";
import {
  initialFormState,
  initialFormUIState,
} from "../store/productForm/states";
import { formControl, formUIControl } from "../store/productForm/reducers";

export const ProductFormContext = createContext();
export const ProductFormUIContext = createContext();
export const ProductFormStateContext = createContext();

const ProductFormProvider = ({ children }) => {
  const [formState, formDispatch] = useReducer(formControl, initialFormState);
  const [uiState, uiDispatch] = useReducer(formUIControl, initialFormUIState);

  const values = useMemo(
    () => ({
      formState,
      formDispatch,
      uiState,
      uiDispatch,
    }),
    [formState, formDispatch, uiState, uiDispatch]
  );

  return (
    <ProductFormContext.Provider value={values}>
      <ProductFormStateProvider>
        <ProductFormUIProvider>{children}</ProductFormUIProvider>
      </ProductFormStateProvider>
    </ProductFormContext.Provider>
  );
};

export const useProductForm = () => useContext(ProductFormContext);
export const useProductFormUI = () => useContext(ProductFormUIContext);
export const useProductFormState = () => useContext(ProductFormStateContext);

export default ProductFormProvider;
