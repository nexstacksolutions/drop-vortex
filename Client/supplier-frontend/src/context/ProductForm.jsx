import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import productFormSchema from "../schemas/productForm";
import useDebouncedCallback from "../hooks/useDebouncedCallback";
import useFormValidation from "../hooks/useFormValidation";
import { initialState, productFormReducer } from "../store/productFormReducer";
import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  useState,
} from "react";

export const ProductFormContext = createContext();

const ProductFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productFormReducer, initialState);
  const { validateForm } = useFormValidation(productFormSchema, dispatch);
  const [touchedFields, setTouchedFields] = useState({});
  const debouncedValidateForm = useDebouncedCallback(validateForm, 300);

  const multiVariantShippingCondition = useMemo(
    () => state.productDetails.variations?.[0]?.values?.length > 1,
    [state.productDetails.variations]
  );

  const updateFormData = useCallback(
    (name, value) => {
      dispatch({ type: "UPDATE_FIELD", payload: { name, value } });
      setTouchedFields((prev) => ({ ...prev, [name]: true }));
    },
    [dispatch]
  );

  const handleInputChange = useCallback(
    (e, name, value, customizer) => {
      if (e) {
        ({ name, value } = e.target);
      }
      const customizedValue = customizer ? customizer(value) : value;
      updateFormData(name, customizedValue);
    },
    [updateFormData]
  );

  const handleAddVariantItem = useCallback(
    (inputValue, variantImages = [], variationIndex) => {
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
        type: "ADD_VARIANT_ITEM",
        payload: { newVariant, variationIndex },
      });
    },
    [dispatch]
  );

  const handleRemoveVariantItem = useCallback(
    (variationIndex, valueIndex) => {
      dispatch({
        type: "REMOVE_VARIANT_ITEM",
        payload: { variationIndex, valueIndex },
      });
    },
    [dispatch]
  );

  const handleApplyToAll = useCallback(() => {
    const { pricing, stock, sku } = state.productDetails;
    dispatch({
      type: "APPLY_TO_ALL_VARIANTS",
      payload: { pricing, stock, sku },
    });
  }, [dispatch, state.productDetails]);

  const handleToggleVariantShipping = useCallback(() => {
    dispatch({ type: "TOGGLE_VARIANT_SHIPPING" });
  }, [dispatch]);

  const toggleAdditionalFields = useCallback(
    (section) => {
      dispatch({ type: "TOGGLE_ADDITIONAL_FIELDS", payload: { section } });
    },
    [dispatch]
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
    if (!fieldPath || fieldPath.includes("uiState")) return false;

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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (e.nativeEvent.submitter.name !== "submitBtn") return;

      dispatch({ type: "SET_FORM_SUBMITTED", payload: true });
      const isFormValid = await validateForm(state);
      const currentErrorsExist = Object.keys(state.formErrors).length > 0;

      if (!isFormValid) {
        if (currentErrorsExist) {
          console.error(
            "Form submission blocked due to errors:",
            state.formErrors
          );
        }
        return; // Stop submission if there are errors
      }

      console.log("Form submitted successfully", state);
    },
    [state, validateForm, dispatch]
  );

  // Effect for debounced validation
  useEffect(() => {
    const hasErrors = Object.keys(state.formErrors).some(
      (field) => touchedFields[field]
    );
    if (hasErrors) {
      debouncedValidateForm(state);
    }
  }, [state.formErrors, touchedFields, debouncedValidateForm, state]);

  // Fetch required fields
  useEffect(() => {
    const fetchRequiredFields = async () => {
      try {
        const formDataKeys = getNestedKeys(initialState);
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
        dispatch({ type: "SET_REQUIRED_FIELDS", payload: filteredStatuses });
      } catch (error) {
        console.error("Error fetching required fields:", error);
      }
    };

    fetchRequiredFields();
  }, [getNestedKeys, isFieldRequired]);

  useEffect(() => {
    if (!multiVariantShippingCondition) {
      dispatch({ type: "SET_VARIANT_SHIPPING_FALSE" });
    }
  }, [multiVariantShippingCondition, dispatch]);

  const values = useMemo(
    () => ({
      state,
      dispatch,
      formErrors: state.formErrors,
      requiredFields: state.requiredFields,
      validateForm,
      isFieldRequired,
      handleInputChange,
      handleAddVariantItem,
      handleRemoveVariantItem,
      multiVariantShippingCondition,
      handleApplyToAll,
      handleToggleVariantShipping,
      toggleAdditionalFields,
      handleSubmit,
    }),
    [
      state,
      dispatch,
      validateForm,
      handleInputChange,
      handleAddVariantItem,
      handleRemoveVariantItem,
      multiVariantShippingCondition,
      handleApplyToAll,
      handleToggleVariantShipping,
      toggleAdditionalFields,
      handleSubmit,
      isFieldRequired,
    ]
  );

  return (
    <ProductFormContext.Provider value={values}>
      {children}
    </ProductFormContext.Provider>
  );
};

// Custom hook to use product form context
export const useProductForm = () => useContext(ProductFormContext);

export default ProductFormProvider;
