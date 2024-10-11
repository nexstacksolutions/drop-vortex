import { v4 as uuidv4 } from "uuid";
import { get } from "lodash";
import formSchema from "../schemas/productForm";
import useFormValidation from "../hooks/useFormValidation";
import { formUI, uiControl } from "../store/formUIReducer";
import { formState, formControl } from "../store/formStateReducer";
import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import useFormGuide from "../hooks/useFormGuide";

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

  console.log(sectionRefs);

  const multiVariantShippingCondition = useMemo(
    () => state.productDetails?.variations?.[0]?.values?.length > 1,
    [state.productDetails?.variations]
  );

  const updateFormData = useCallback(
    async (name, value) => {
      dispatch({ type: "UPDATE_FIELD", payload: { name, value } });
      await validateField(state, name, value);
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
    async (basePath, updatedVariants) => {
      updateFormData(basePath, updatedVariants);
      uiDispatch({
        type: "TOGGLE_VARIANT_PRICING",
        payload: updatedVariants.length > 0,
      });
    },
    [updateFormData]
  );

  const handleAddVariantItem = useCallback(
    async (inputValue, variantImages = [], variationIndex, valueIndex) => {
      if (!inputValue.trim()) return;

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
      const updatedVariants = [...get(state, basePath), newVariant];

      await updateVariantData(basePath, updatedVariants);

      const AdditionalEmptyFields = {
        [`${basePath}[${updatedVariants.length - 1}].pricing.original`]: true,
        [`${basePath}[${updatedVariants.length - 1}].stock`]: true,
        [`${basePath}[${updatedVariants.length - 1}].dimensions`]: true,
        [`${basePath}[${updatedVariants.length - 1}].packageWeight`]: true,
      };

      uiDispatch({
        type: "SET_EMPTY_FIELDS",
        payload: AdditionalEmptyFields,
      });
    },
    [state, updateVariantData]
  );

  const handleRemoveVariantItem = useCallback(
    async (variationIndex, valueIndex) => {
      const updatedVariants = state.productDetails.variations[
        variationIndex
      ].values.filter((_, idx) => idx !== valueIndex);

      dispatch({
        type: "REMOVE_VARIANT_ITEM",
        payload: { variationIndex, valueIndex },
      });

      uiDispatch({
        type: "TOGGLE_VARIANT_PRICING",
        payload: updatedVariants?.length > 0,
      });

      await validateField(
        state,
        `productDetails.variations[${variationIndex}].values`,
        updatedVariants
      );

      const basePath = `productDetails.variations[${variationIndex}].values${valueIndex}]`;

      const fieldsToRemove = {
        [`${basePath}.pricing.original`]: true,
        [`${basePath}.stock`]: true,
        [`${basePath}.dimensions`]: true,
        [`${basePath}.packageWeight`]: true,
      };

      uiDispatch({
        type: "CLEAR_EMPTY_FIELDS",
        payload: fieldsToRemove,
      });
    },
    [dispatch, state, validateField]
  );

  const handleApplyToAll = useCallback(() => {
    const { pricing, stock, sku } = state.productDetails;
    dispatch({
      type: "APPLY_TO_ALL_VARIANTS",
      payload: { pricing, stock, sku },
    });
  }, [dispatch, state.productDetails]);

  const handleToggleVariantShipping = useCallback(() => {
    uiDispatch({ type: "TOGGLE_VARIANT_SHIPPING" });
  }, [uiDispatch]);

  const toggleAdditionalFields = useCallback(
    (section) => {
      uiDispatch({
        type: "TOGGLE_ADDITIONAL_FIELDS",
        payload: { section },
      });
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

  // Fetch required fields only on first render
  const fetchRequiredFields = useCallback(async () => {
    try {
      await validateForm(state, true, "SET_REQUIRED_FIELDS");
    } catch (error) {
      console.error("Error fetching required fields:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch Empty fields only on first render
  const fetchEmptyFields = useCallback(async () => {
    try {
      await validateForm(state, true, "SET_EMPTY_FIELDS");
    } catch (error) {
      console.error("Error fetching empty fields:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchEmptyFields();
    fetchRequiredFields();
  }, [fetchEmptyFields, fetchRequiredFields]);

  useEffect(() => {
    if (!multiVariantShippingCondition)
      uiDispatch({ type: "SET_VARIANT_SHIPPING_FALSE" });
  }, [multiVariantShippingCondition, uiDispatch]);

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
      handleAddVariantItem,
      toggleAdditionalFields,
      handleRemoveVariantItem,
      handleToggleVariantShipping,
      multiVariantShippingCondition,
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
      handleAddVariantItem,
      handleRemoveVariantItem,
      handleToggleVariantShipping,
      toggleAdditionalFields,
      multiVariantShippingCondition,
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
