import { get } from "lodash";
import { v4 as uuidv4 } from "uuid";
import formSchema from "../schemas/productForm";
import { useMemo, useCallback } from "react";
import useFormValidation from "../hooks/pages/ProductForm/useFormValidation";
import { ProductFormStateContext, useProductForm } from "./ProductForm";

export const ProductFormStateProvider = ({ children }) => {
  const { formState, formDispatch, uiState, uiDispatch } = useProductForm();
  const { validateField } = useFormValidation(formSchema, uiState, uiDispatch);

  const updateFormData = useCallback(
    (name, value) => {
      formDispatch({ type: "UPDATE_FIELD", payload: { name, value } });
      validateField(formState, name, value);
    },
    [formDispatch, formState, validateField]
  );

  const handleInputChange = useCallback(
    (e, name, value, customizer) => {
      if (e) {
        ({ name, value } = e.target);
      }
      updateFormData(name, customizer ? customizer(value) : value);
    },
    [updateFormData]
  );

  const updateVariantData = useCallback(
    async (basePath, updatedVariants, dispatchType, payload) => {
      updateFormData(basePath, updatedVariants);
      uiDispatch({
        type: "TOGGLE_VARIANT_PRICING",
        payload: updatedVariants.length > 0,
      });
      uiDispatch({ type: dispatchType, payload });
    },
    [updateFormData, uiDispatch]
  );

  const updateVariantItem = useCallback(
    async (
      inputValue,
      variantImages = [],
      variationIndex,
      valueIndex,
      isAdding
    ) => {
      const newVariant = {
        id: uuidv4(),
        name: inputValue,
        variantImages,
        pricing: { current: "", original: "" },
        stock: "",
        availability: true,
        freeItems: "",
        sku: "",
        packageWeight: "",
        dimensions: { length: "", width: "", height: "" },
      };

      const basePath = `productDetails.variations[${variationIndex}].values`;

      const updatedVariants = isAdding
        ? [...get(formState, basePath), newVariant]
        : formState.productDetails.variations[variationIndex].values.filter(
            (_, idx) => idx !== valueIndex
          );

      const updatedValueIndex = isAdding
        ? updatedVariants.length - 1
        : valueIndex;

      const additionalFields = {
        [`${basePath}[${updatedValueIndex}].pricing.original`]: true,
        [`${basePath}[${updatedValueIndex}].stock`]: true,
        [`${basePath}[${updatedValueIndex}].dimensions`]: true,
        [`${basePath}[${updatedValueIndex}].packageWeight`]: true,
      };

      await updateVariantData(
        basePath,
        updatedVariants,
        isAdding ? "SET_EMPTY_FIELDS" : "CLEAR_EMPTY_FIELDS",
        isAdding
          ? additionalFields
          : { ...additionalFields, removedIndex: valueIndex }
      );
    },
    [formState, updateVariantData]
  );

  const handleApplyToAll = useCallback(() => {
    const { pricing, stock, sku } = formState.productDetails;
    formDispatch({
      type: "APPLY_TO_ALL_VARIANTS",
      payload: { pricing, stock, sku },
    });
  }, [formDispatch, formState.productDetails]);

  const values = useMemo(
    () => ({
      formState,
      formDispatch,
      handleInputChange,
      updateVariantItem,
      handleApplyToAll,
    }),
    [
      formState,
      formDispatch,
      handleInputChange,
      updateVariantItem,
      handleApplyToAll,
    ]
  );

  return (
    <ProductFormStateContext.Provider value={values}>
      {children}
    </ProductFormStateContext.Provider>
  );
};
