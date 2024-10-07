import { v4 as uuidv4 } from "uuid";
import productFormSchema from "../schemas/productForm";
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
    productFormSchema,
    uiState,
    uiDispatch
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const multiVariantShippingCondition = useMemo(
    () => state.productDetails?.variations?.[0]?.values?.length > 1,
    [state.productDetails?.variations]
  );

  const updateFormData = useCallback(
    async (name, value) => {
      try {
        dispatch({ type: "UPDATE_FIELD", payload: { name, value } });
        await validateField(state, name, value);
      } catch (error) {
        console.error("Error updating form data:", error);
      }
    },
    [validateField, state]
  );

  const handleInputChange = useCallback(
    (e, name, value, customizer) => {
      if (e) ({ name, value } = e.target);
      updateFormData(name, customizer ? customizer(value) : value);
    },
    [updateFormData]
  );

  const handleAddVariantItem = useCallback(
    async (inputValue, variantImages = [], variationIndex) => {
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

      const updatedVariants = [
        ...state.productDetails.variations[variationIndex].values,
        newVariant,
      ];

      dispatch({
        type: "ADD_VARIANT_ITEM",
        payload: { newVariant, variationIndex },
      });

      await validateField(
        state,
        `productDetails.variations[${variationIndex}].values`,
        updatedVariants
      );
    },
    [dispatch, state, validateField]
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

      await validateField(
        state,
        `productDetails.variations[${variationIndex}].values`,
        updatedVariants
      );
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
      const canSubmit = !(
        uiState.isSubmitting || e.nativeEvent.submitter.name !== "submitBtn"
      );

      e.preventDefault();
      if (!canSubmit) return;

      uiDispatch({ type: "SET_IS_SUBMITTING", payload: true });
      try {
        const isValid = await validateForm(state);
        if (isValid) {
          console.log("Form submitted successfully", state);
        } else {
          console.log("Validation failed", uiState.formErrors);
        }
      } catch (error) {
        console.error("Error during submission", error);
      } finally {
        uiDispatch({ type: "SET_IS_SUBMITTING", payload: false });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [fetchEmptyFields]);

  useEffect(() => {
    fetchRequiredFields();
  }, [fetchRequiredFields]);

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
