import { get } from "lodash";
import { useMemo, useCallback } from "react";
import formSchema from "../schemas/productForm/productForm";
import { ProductFormStateContext, useProductForm } from "./ProductForm";
import useFormValidation from "../pages/Products/Actions/hooks/useFormValidation";
import { createNewVariant } from "../utils/productForm";
import { formActions, formUIActions } from "../store/productForm/actions";

export const ProductFormStateProvider = ({ children }) => {
  const { formState, formDispatch, uiState, uiDispatch } = useProductForm();
  const { validateField } = useFormValidation(formSchema, uiState, uiDispatch);

  const updateFormData = useCallback(
    (name, value) => {
      formDispatch(formActions.updateField({ name, value }));
      validateField(formState, name, value);
    },
    [formDispatch, formState, validateField]
  );

  const handleInputChange = useCallback(
    (e, name, value, customizer) => {
      if (e) ({ name, value } = e.target);
      updateFormData(name, customizer ? customizer(value) : value);
    },
    [updateFormData]
  );

  const updateVariantData = useCallback(
    async (basePath, updatedVariants, isAdding, payload) => {
      updateFormData(basePath, updatedVariants);
      uiDispatch(formUIActions.toggleVariantValues(updatedVariants.length > 0));
      uiDispatch(
        isAdding
          ? formUIActions.setEmptyFields(payload)
          : formUIActions.clearEmptyFields(payload)
      );
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
      const newVariant = createNewVariant(inputValue, variantImages);
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
        [`${basePath}[${updatedValueIndex}].pricing.original.amount`]: true,
        [`${basePath}[${updatedValueIndex}].stock`]: true,
        [`${basePath}[${updatedValueIndex}].dimensions`]: true,
        [`${basePath}[${updatedValueIndex}].packageWeight.value`]: true,
      };

      await updateVariantData(
        basePath,
        updatedVariants,
        isAdding,
        isAdding
          ? additionalFields
          : { ...additionalFields, removedIndex: valueIndex }
      );
    },
    [formState, updateVariantData]
  );

  const handleApplyToAll = useCallback(() => {
    const { pricing, stock, sku } = formState.productDetails;
    formDispatch(formActions.applyToAllVariants({ pricing, stock, sku }));
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
