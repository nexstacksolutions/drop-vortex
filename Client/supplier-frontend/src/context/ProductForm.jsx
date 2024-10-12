import { v4 as uuidv4 } from "uuid";
import { get } from "lodash";
import formSchema from "../schemas/productForm";
import useFormValidation from "../hooks/useFormValidation";
import { formUI, uiControl } from "../store/formUIReducer";
import { formState, formControl } from "../store/formStateReducer";
import useFormGuide from "../hooks/useFormGuide";
import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";

export const ProductFormContext = createContext();

const ProductFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formControl, formState);
  const [uiState, uiDispatch] = useReducer(uiControl, formUI);
  const { guideContent, updateGuideContent } = useFormGuide();
  const { validateForm, validateField } = useFormValidation(
    formSchema,
    uiState,
    uiDispatch
  );

  const sectionRefs = useRef(
    Array.from({ length: 5 }, () => React.createRef())
  );

  const updateFormData = useCallback(
    (name, value) => {
      dispatch({ type: "UPDATE_FIELD", payload: { name, value } });
      validateField(state, name, value);
    },
    [dispatch, state, validateField]
  );

  const handleInputChange = useCallback(
    (e, name, value, customizer) => {
      if (e) ({ name, value } = e.target);
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
    [updateFormData]
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
        ? [...get(state, basePath), newVariant]
        : state.productDetails.variations[variationIndex].values.filter(
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
        additionalFields
      );
    },
    [state, updateVariantData]
  );

  const handleApplyToAll = useCallback(() => {
    const { pricing, stock, sku } = state.productDetails;
    dispatch({
      type: "APPLY_TO_ALL_VARIANTS",
      payload: { pricing, stock, sku },
    });
  }, [dispatch, state.productDetails]);

  const toggleVariantShipping = useCallback(() => {
    uiDispatch({ type: "TOGGLE_VARIANT_SHIPPING" });
  }, [uiDispatch]);

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
        const isValid = await validateForm(state);
        console.log(
          isValid ? "Form submitted successfully" : "Validation failed",
          state
        );
      } catch (error) {
        console.error("Error during submission", error);
      } finally {
        uiDispatch({ type: "SET_IS_SUBMITTING", payload: false });
      }
    },
    [state, validateForm, uiState.isSubmitting]
  );

  const isVariantShipping = useMemo(
    () => state.productDetails?.variations?.[0]?.values?.length > 1,
    [state.productDetails?.variations]
  );

  useEffect(() => {
    // Fetching Require fields only on first render
    const fetchFields = async (fieldType) => {
      try {
        await validateForm(state, true, fieldType);
      } catch (error) {
        console.error(`Error fetching ${fieldType}:`, error);
      }
    };

    fetchFields("SET_REQUIRED_FIELDS");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isVariantShipping) uiDispatch({ type: "SET_VARIANT_SHIPPING_FALSE" });
  }, [isVariantShipping]);

  const values = useMemo(
    () => ({
      state,
      dispatch,
      uiState,
      uiDispatch,
      sectionRefs,
      handleSubmit,
      validateField,
      guideContent,
      updateGuideContent,
      handleApplyToAll,
      handleInputChange,
      updateVariantItem,
      toggleAdditionalFields,
      toggleVariantShipping,
      isVariantShipping,
      formErrors: uiState.formErrors,
      emptyFields: uiState.emptyFields,
      requiredFields: uiState.requiredFields,
    }),
    [
      state,
      uiState,
      sectionRefs,
      handleSubmit,
      validateField,
      guideContent,
      updateGuideContent,
      handleApplyToAll,
      handleInputChange,
      updateVariantItem,
      toggleVariantShipping,
      toggleAdditionalFields,
      isVariantShipping,
    ]
  );

  return (
    <ProductFormContext.Provider value={values}>
      {children}
    </ProductFormContext.Provider>
  );
};

export const useProductForm = () => useContext(ProductFormContext);
export default ProductFormProvider;
