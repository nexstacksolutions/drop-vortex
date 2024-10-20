import formSchema from "../schemas/productForm";
import useFormGuide from "../hooks/pages/ProductForm/useFormGuide";
import useContentScore from "../hooks/pages/ProductForm/useContentScore";
import useFormValidation from "../hooks/pages/ProductForm/useFormValidation";
import { ProductFormUIContext, useProductForm } from "./ProductForm";
import { createRef, useMemo, useEffect, useRef, useCallback } from "react";

export const ProductFormUIProvider = ({ children }) => {
  const { uiState, uiDispatch, formState } = useProductForm();
  const { inputGuidance, updateInputGuidance } = useFormGuide();
  const sectionRefs = useRef(Array.from({ length: 5 }, () => createRef()));
  const {
    formErrors,
    emptyFields,
    requiredFields,
    additionalFields,
    variantShipping,
    variantValues,
  } = uiState;
  const { contentScore } = useContentScore(
    formState,
    emptyFields,
    requiredFields,
    variantShipping,
    variantValues
  );

  const { validateForm, validateField } = useFormValidation(
    formSchema,
    uiState,
    uiDispatch
  );

  const toggleVariantShipping = useCallback(
    () => uiDispatch({ type: "TOGGLE_VARIANT_SHIPPING" }),
    [uiDispatch]
  );

  const toggleAdditionalFields = useCallback(
    (section) => {
      uiDispatch({ type: "TOGGLE_ADDITIONAL_FIELDS", payload: section });
    },
    [uiDispatch]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (uiState.isSubmitting || e.nativeEvent.submitter.name !== "submitBtn")
        return;

      uiDispatch({ type: "SET_IS_SUBMITTING", payload: true });
      try {
        const isValid = await validateForm(formState);
        console.log(
          isValid ? "Form submitted successfully" : "Validation failed",
          formState
        );
      } catch (error) {
        console.error("Error during submission", error);
      } finally {
        uiDispatch({ type: "SET_IS_SUBMITTING", payload: false });
      }
    },
    [formState, validateForm, uiDispatch, uiState.isSubmitting]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchFields = async (fieldType) => {
      try {
        if (isMounted) {
          await validateForm(formState, true, fieldType);
        }
      } catch (error) {
        if (isMounted) {
          console.error(`Error fetching ${fieldType}:`, error);
        }
      }
    };

    fetchFields("SET_REQUIRED_FIELDS");

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!uiState.variantValues)
      uiDispatch({ type: "SET_VARIANT_SHIPPING_FALSE" });
  }, [uiState.variantValues, uiDispatch]);

  const values = useMemo(
    () => ({
      uiState,
      uiDispatch,
      sectionRefs,
      contentScore,
      handleSubmit,
      validateField,
      inputGuidance,
      updateInputGuidance,
      toggleAdditionalFields,
      toggleVariantShipping,
      formErrors,
      emptyFields,
      requiredFields,
      additionalFields,
      variantShipping,
      variantValues,
    }),
    [
      uiState,
      uiDispatch,
      sectionRefs,
      contentScore,
      handleSubmit,
      validateField,
      inputGuidance,
      updateInputGuidance,
      toggleAdditionalFields,
      toggleVariantShipping,
      formErrors,
      emptyFields,
      requiredFields,
      additionalFields,
      variantShipping,
      variantValues,
    ]
  );

  return (
    <ProductFormUIContext.Provider value={values}>
      {children}
    </ProductFormUIContext.Provider>
  );
};
