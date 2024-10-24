import formSchema from "../schemas/productForm/productForm";
import useFormGuide from "../pages/Products/Actions/hooks/useFormGuide";
import useContentScore from "../pages/Products/Actions/hooks/useContentScore";
import useFormValidation from "../pages/Products/Actions/hooks/useFormValidation";
import { ProductFormUIContext, useProductForm } from "./ProductForm";
import { createRef, useMemo, useEffect, useRef, useCallback } from "react";
import { formUIActions } from "../store/productForm/actions";

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
    () => uiDispatch(formUIActions.toggleVariantShipping()),
    [uiDispatch]
  );

  const toggleAdditionalFields = useCallback(
    (section) => {
      uiDispatch(formUIActions.toggleAdditionalFields(section));
    },
    [uiDispatch]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (uiState.isSubmitting || e.nativeEvent.submitter.name !== "submitBtn")
        return;

      uiDispatch(formUIActions.setIsSubmitting(true));
      try {
        const isValid = await validateForm(formState);
        console.log(
          isValid ? "Form submitted successfully" : "Validation failed",
          formState
        );
      } catch (error) {
        console.error("Error during submission", error);
      } finally {
        uiDispatch(formUIActions.setIsSubmitting(false));
      }
    },
    [formState, validateForm, uiDispatch, uiState.isSubmitting]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchFields = async (fieldType) => {
      try {
        if (isMounted) {
          await validateForm(formState, formUIActions.setRequiredFields);
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
    if (!uiState.variantValues) {
      uiDispatch(formUIActions.toggleVariantShipping(true));
    }
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
