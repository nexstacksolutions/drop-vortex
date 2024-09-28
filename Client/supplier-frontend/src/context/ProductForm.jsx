import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import debounce from "lodash/debounce";
import productFormSchema from "../schemas/productForm";
import { initialState, productFormReducer } from "../store/productFormReducer";
import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

export const ProductFormContext = createContext();

const ProductFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productFormReducer, initialState);

  const multiVariantShippingCondition = useMemo(() => {
    return state.productDetails.variations?.[0]?.values?.length > 1;
  }, [state.productDetails.variations]);

  // Handle update input Changes
  const updateFormData = useCallback(
    (name, value) => {
      dispatch({ type: "UPDATE_FIELD", payload: { name, value } });
    },
    [dispatch]
  );

  // Handle Input Change
  const handleInputChange = useCallback(
    (e, name, value, customizer) => {
      if (e) {
        ({ name, value } = e.target);
      }

      console.log(e, name, value, customizer);

      const customizedValue = customizer ? customizer(value) : value;
      updateFormData(name, customizedValue);
    },
    [updateFormData]
  );

  // Debounce the input change event to optimize performance
  const handleDebouncedChange = useMemo(
    () => debounce(handleInputChange, 300),
    [handleInputChange]
  );

  // Handle Add Variant Item in variations
  const handleAddVariantItem = useCallback(
    (inputValue, variantImages, variationIndex) => {
      if (!inputValue.trim()) return;

      const newVariant = {
        id: uuidv4(),
        name: inputValue,
        variantImages: variantImages || [],
        pricing: { current: "", original: "" },
        stock: "",
        availability: true,
        freeItems: "",
        sku: "",
        packageWeight: "",
        dimensions: { length: "", width: "", height: "" },
      };

      // Dispatch to update the state in context
      dispatch({
        type: "ADD_VARIANT_ITEM",
        payload: { newVariant, variationIndex },
      });
    },
    [dispatch]
  );

  // Remove a variant item
  const handleRemoveVariantItem = useCallback(
    (variationIndex, valueIndex) => {
      // Dispatch to remove a variant item
      dispatch({
        type: "REMOVE_VARIANT_ITEM",
        payload: { variationIndex, valueIndex },
      });
    },
    [dispatch]
  );

  // Apply to all variants
  const handleApplyToAll = useCallback(() => {
    const { pricing, stock, sku } = state.productDetails;

    dispatch({
      type: "APPLY_TO_ALL_VARIANTS",
      payload: { pricing, stock, sku },
    });
  }, [dispatch, state.productDetails]);

  // Toggle variant shipping
  const handleToggleVariantShipping = useCallback(() => {
    // Dispatch to toggle variant shipping
    dispatch({ type: "TOGGLE_VARIANT_SHIPPING" });
  }, [dispatch]);

  // Toggle additional fields
  const toggleAdditionalFields = useCallback(
    (section) => {
      // Dispatch to toggle additional fields
      dispatch({ type: "TOGGLE_ADDITIONAL_FIELDS", payload: { section } });
    },
    [dispatch]
  );

  // debounce form Validations for efficiency
  const debouncedValidate = debounce(async (state, dispatch) => {
    try {
      await productFormSchema.validate(state, { abortEarly: false });
      dispatch({ type: "CLEAR_FORM_ERRORS" });
      return true;
    } catch (error) {
      const errors = error.inner.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      dispatch({ type: "SET_FORM_ERRORS", payload: errors });
      console.log(errors);

      return false;
    }
  }, 300);

  // Validate form on input change and debounce for efficiency
  const validateForm = useCallback(() => {
    debouncedValidate(state, dispatch);
  }, [state, dispatch, debouncedValidate]);

  // Get Required field value
  const isFieldRequired = useCallback(async (fieldPath) => {
    try {
      if (!fieldPath || fieldPath.includes("uiState")) return;
      const validationSchema = Yup.reach(productFormSchema, fieldPath);
      const isRequired =
        validationSchema?.tests?.some((test) => test.name === "validate") ||
        false;

      return isRequired;
    } catch (error) {
      console.error("Field path not found in schema:", error);
      return false;
    }
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (e.nativeEvent.submitter.name !== "submitBtn") return;

      const isValid = await validateForm();
      if (isValid) {
        console.log("Form submitted successfully", state);
        // Handle form submission logic (e.g., API call)
      } else {
        // Display validation errors in the UI
      }
    },
    [state, validateForm]
  );

  // Get nested keys to Fetch required fields
  const getNestedKeys = (obj, parent = "") => {
    let keys = [];
    for (let key in obj) {
      const fullKey = parent ? `${parent}.${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        keys = keys.concat(getNestedKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  };

  // Fetch required fields on initial render to show Asterisk icons in label
  useEffect(() => {
    const fetchRequiredFields = async () => {
      let requiredFieldStatuses = {};
      const formDataKeys = getNestedKeys(state);
      console.log(formDataKeys);

      await Promise.all(
        formDataKeys.map(async (field) => {
          const isRequired = await isFieldRequired(field);

          if (isRequired === undefined) return;
          requiredFieldStatuses[field] = isRequired;
        })
      );

      // Dispatch required fields to the reducer
      dispatch({ type: "SET_REQUIRED_FIELDS", payload: requiredFieldStatuses });
    };

    fetchRequiredFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply shipping condition based on multi-variant shipping
  useEffect(() => {
    if (!multiVariantShippingCondition) {
      dispatch({ type: "SET_VARIANT_SHIPPING_FALSE" });
    }
  }, [multiVariantShippingCondition, dispatch]);

  // Create memoized state values
  const values = useMemo(
    () => ({
      state,
      dispatch,
      formErrors: state.formErrors, // Now from state
      requiredFields: state.requiredFields, // Now from state
      isFieldRequired,
      handleInputChange,
      handleDebouncedChange,
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
      isFieldRequired,
      handleInputChange,
      handleDebouncedChange,
      handleAddVariantItem,
      handleRemoveVariantItem,
      multiVariantShippingCondition,
      handleApplyToAll,
      handleToggleVariantShipping,
      toggleAdditionalFields,
      handleSubmit,
    ]
  );

  return (
    <ProductFormContext.Provider value={values}>
      {children}
    </ProductFormContext.Provider>
  );
};

// Custom hook to get values from the context
export function useProductForm() {
  return useContext(ProductFormContext);
}

export default ProductFormProvider;
