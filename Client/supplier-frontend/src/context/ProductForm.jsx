import * as Yup from "yup";
import { produce } from "immer";
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
  useCallback,
} from "react";

export const ProductFormContext = createContext();

const actionTypes = Object.freeze({
  UPDATE_FIELD: "UPDATE_FIELD",
  SET_FIELD_ERROR: "SET_FIELD_ERROR",
  SET_FORM_ERRORS: "SET_FORM_ERRORS",
  CLEAR_FORM_ERRORS: "CLEAR_FORM_ERRORS",
  ADD_VARIANT_ITEM: "ADD_VARIANT_ITEM",
  REMOVE_VARIANT_ITEM: "REMOVE_VARIANT_ITEM",
  APPLY_TO_ALL_VARIANTS: "APPLY_TO_ALL_VARIANTS",
  TOGGLE_VARIANT_SHIPPING: "TOGGLE_VARIANT_SHIPPING",
  TOGGLE_ADDITIONAL_FIELDS: "TOGGLE_ADDITIONAL_FIELDS",
  SET_FORM_SUBMITTED: "SET_FORM_SUBMITTED",
  SET_REQUIRED_FIELDS: "SET_REQUIRED_FIELDS",
  SET_VARIANT_SHIPPING_FALSE: "SET_VARIANT_SHIPPING_FALSE",
});

const ProductFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formControl, formState);
  const [uiState, uiDispatch] = useReducer(uiControl, formUI);
  const { validateForm, validateField } = useFormValidation(
    productFormSchema,
    uiState,
    uiDispatch
  );

  const multiVariantShippingCondition = useMemo(
    () => state.productDetails?.variations?.[0]?.values?.length > 1,
    [state.productDetails?.variations]
  );

  // Utility function to handle field updates and validation
  const updateFormData = useCallback(
    async (name, value) => {
      dispatch({ type: actionTypes.UPDATE_FIELD, payload: { name, value } });
      await validateField(name, value);
    },
    [validateField]
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
      dispatch({
        type: actionTypes.ADD_VARIANT_ITEM,
        payload: { newVariant, variationIndex },
      });
      await validateField(
        `productDetails.variations[${variationIndex}].values`,
        [...state.productDetails.variations[variationIndex].values, newVariant]
      );
    },
    [dispatch, state.productDetails.variations, validateField]
  );

  const handleRemoveVariantItem = useCallback(
    async (variationIndex, valueIndex) => {
      dispatch({
        type: actionTypes.REMOVE_VARIANT_ITEM,
        payload: { variationIndex, valueIndex },
      });
      const updatedVariants = state.productDetails.variations[
        variationIndex
      ].values.filter((_, idx) => idx !== valueIndex);
      await validateField(
        `productDetails.variations[${variationIndex}].values`,
        updatedVariants
      );
    },
    [dispatch, state.productDetails.variations, validateField]
  );

  const handleApplyToAll = useCallback(() => {
    const { pricing, stock, sku } = state.productDetails;
    dispatch({
      type: actionTypes.APPLY_TO_ALL_VARIANTS,
      payload: { pricing, stock, sku },
    });
  }, [dispatch, state.productDetails]);

  const handleToggleVariantShipping = useCallback(() => {
    uiDispatch({ type: actionTypes.TOGGLE_VARIANT_SHIPPING });
  }, [uiDispatch]);

  const toggleAdditionalFields = useCallback(
    (section) => {
      uiDispatch({
        type: actionTypes.TOGGLE_ADDITIONAL_FIELDS,
        payload: { section },
      });
    },
    [uiDispatch]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (e.nativeEvent.submitter.name !== "submitBtn") return;

      uiDispatch({ type: actionTypes.SET_FORM_SUBMITTED, payload: true });
      if (
        (await validateForm(state)) &&
        !Object.keys(uiState.formErrors).length
      ) {
        console.log("Form submitted successfully", state);
      } else {
        console.error(
          "Form submission blocked due to errors:",
          uiState.formErrors
        );
      }
    },
    [state, validateForm, uiDispatch, uiState.formErrors]
  );

  const getNestedKeys = useCallback((obj, parent = "") => {
    return Object.keys(obj).reduce((keys, key) => {
      const fullKey = parent ? `${parent}.${key}` : key;
      return typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
        ? keys.concat(getNestedKeys(obj[key], fullKey))
        : keys.concat(fullKey);
    }, []);
  }, []);

  const isFieldRequired = useCallback(async (fieldPath) => {
    if (!fieldPath) return false;

    try {
      const validationSchema = Yup.reach(productFormSchema, fieldPath);
      return (
        validationSchema?.tests?.some((test) => test.name === "validate") ||
        false
      );
    } catch {
      return false;
    }
  }, []);

  // Fetch required fields only on first render
  useEffect(() => {
    const fetchRequiredFields = async () => {
      try {
        const formDataKeys = getNestedKeys(formState);
        const requiredFieldStatuses = await Promise.all(
          formDataKeys.map(async (field) => {
            const isRequired = await isFieldRequired(field);
            return isRequired !== undefined ? { [field]: isRequired } : null;
          })
        );
        const filteredStatuses = Object.assign(
          {},
          ...requiredFieldStatuses.filter(Boolean)
        );
        uiDispatch({
          type: actionTypes.SET_REQUIRED_FIELDS,
          payload: filteredStatuses,
        });
      } catch (error) {
        console.error("Error fetching required fields:", error);
      }
    };

    fetchRequiredFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!multiVariantShippingCondition)
      uiDispatch({ type: actionTypes.SET_VARIANT_SHIPPING_FALSE });
  }, [multiVariantShippingCondition, uiDispatch]);

  const values = useMemo(
    () => ({
      state,
      dispatch,
      uiState,
      uiDispatch,
      handleSubmit,
      handleApplyToAll,
      handleInputChange,
      handleAddVariantItem,
      handleRemoveVariantItem,
      toggleAdditionalFields,
      handleToggleVariantShipping,
      multiVariantShippingCondition,
      formErrors: uiState.formErrors,
      requiredFields: uiState.requiredFields,
    }),
    [
      state,
      uiState,
      handleSubmit,
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
