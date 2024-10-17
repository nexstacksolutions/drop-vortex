import { formState, formControl } from "../store/formStateReducer";
import { formUI, uiControl } from "../store/formUIReducer";
import { createContext, useContext, useReducer, useMemo } from "react";
import { ProductFormStateProvider } from "./ProductFormState";
import { ProductFormUIProvider } from "./ProductFormUI";

export const ProductFormContext = createContext();
export const ProductFormUIContext = createContext();
export const ProductFormStateContext = createContext();

const ProductFormProvider = ({ children }) => {
  const [state, formDispatch] = useReducer(formControl, formState);
  const [uiState, uiDispatch] = useReducer(uiControl, formUI);

  const values = useMemo(
    () => ({
      formState: state,
      formDispatch,
      uiState,
      uiDispatch,
    }),
    [state, formDispatch, uiState, uiDispatch]
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
