import formSchema from "../schemas/productForm";
import useFormGuide from "../hooks/useFormGuide";
import useContentScore from "../hooks/useContentScore";
import useFormValidation from "../hooks/useFormValidation";
import { ProductFormUIContext, useProductForm } from "./ProductForm";
import { createRef, useMemo, useEffect, useRef, useCallback } from "react";

export const ProductFormUIProvider = ({ children }) => {
  const { uiState, uiDispatch, formState } = useProductForm();
  const { guideContent, updateGuideContent } = useFormGuide();
  const sectionRefs = useRef(Array.from({ length: 5 }, () => createRef()));
  const { contentScore } = useContentScore(
    formState,
    uiState.emptyFields,
    uiState.requiredFields,
    uiState.variantShipping,
    uiState.variantPricing
  );

  const { validateForm, validateField } = useFormValidation(
    formSchema,
    uiState,
    uiDispatch
  );

  const { formErrors, emptyFields, requiredFields } = uiState;

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

  const isVariantShipping = useMemo(
    () => formState.productDetails?.variations?.[0]?.values?.length > 1,
    [formState.productDetails?.variations]
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
    if (!isVariantShipping) uiDispatch({ type: "SET_VARIANT_SHIPPING_FALSE" });
  }, [isVariantShipping, uiDispatch]);

  const values = useMemo(
    () => ({
      uiState,
      uiDispatch,
      sectionRefs,
      contentScore,
      handleSubmit,
      validateField,
      guideContent,
      updateGuideContent,
      toggleAdditionalFields,
      toggleVariantShipping,
      isVariantShipping,
      formErrors,
      emptyFields,
      requiredFields,
    }),
    [
      uiState,
      uiDispatch,
      sectionRefs,
      contentScore,
      handleSubmit,
      validateField,
      guideContent,
      updateGuideContent,
      toggleAdditionalFields,
      toggleVariantShipping,
      isVariantShipping,
      formErrors,
      emptyFields,
      requiredFields,
    ]
  );

  return (
    <ProductFormUIContext.Provider value={values}>
      {children}
    </ProductFormUIContext.Provider>
  );
};
