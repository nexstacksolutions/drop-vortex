import { formControl, initialFormState } from "../store/formStateReducer";
import { initialFormUI, uiControl } from "..//store/formUIReducer";
import { createContext, useContext, useReducer, useMemo } from "react";
import { ProductFormStateProvider } from "./ProductFormState";
import { ProductFormUIProvider } from "./ProductFormUI";

export const ProductFormContext = createContext();
export const ProductFormUIContext = createContext();
export const ProductFormStateContext = createContext();

const ProductFormProvider = ({ children }) => {
  const [formState, formDispatch] = useReducer(formControl, initialFormState);
  const [uiState, uiDispatch] = useReducer(uiControl, initialFormUI);

  const values = useMemo(
    () => ({
      formState,
      formDispatch,
      uiState,
      uiDispatch,
      initialFormUI,
      initialFormState,
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
