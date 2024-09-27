import * as Yup from "yup";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import debounce from "lodash/debounce";
import productFormSchema from "../schemas/productFormYup";
import ZodSchema from "../schemas/productFormZod";
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

  const multiVariantShippingCondition =
    state.productDetails.variations.length &&
    state.productDetails.variations[0].values.length > 1;

  const updateFormData = useCallback(
    (name, value) => {
      dispatch({ type: "UPDATE_FIELD", payload: { name, value } });
    },
    [dispatch]
  );

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

  const handleDebouncedChange = useMemo(
    () => debounce(handleInputChange, 300),
    [handleInputChange]
  );

  const handleAddVariantItem = useCallback(
    (inputValue, variantImages, variationIndex) => {
      if (!inputValue.trim()) return;

      const newVariant = {
        id: uuidv4(),
        name: inputValue,
        variantImages: variantImages || [],
        pricing: { current: null, original: null },
        stock: null,
        availability: true,
        freeItems: null,
        sku: "",
        packageWeight: null,
        dimensions: { length: null, width: null, height: null },
      };

      // Dispatch to update the state in context
      dispatch({
        type: "ADD_VARIANT_ITEM",
        payload: { newVariant, variationIndex },
      });
    },
    [dispatch]
  );

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

  const handleApplyToAll = useCallback(() => {
    const { pricing, stock, sku } = state.productDetails;

    dispatch({
      type: "APPLY_TO_ALL_VARIANTS",
      payload: { pricing, stock, sku },
    });
  }, [dispatch, state.productDetails]);

  const handleToggleVariantShipping = useCallback(() => {
    // Dispatch to toggle variant shipping
    dispatch({ type: "TOGGLE_VARIANT_SHIPPING" });
  }, [dispatch]);

  const toggleAdditionalFields = useCallback(
    (section) => {
      // Dispatch to toggle additional fields
      dispatch({ type: "TOGGLE_ADDITIONAL_FIELDS", payload: { section } });
    },
    [dispatch]
  );

  const validateForm = useCallback(async () => {
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
      return false;
    }
  }, [state, dispatch]);

  const validateFormZod = useCallback(async () => {
    try {
      // Validate the state against the Zod schema
      ZodSchema.parse(state); // Use your specific schema

      // Clear any previous form errors
      dispatch({ type: "CLEAR_FORM_ERRORS" });
      return true;
    } catch (error) {
      // Ensure that error is a ZodError and has the expected structure
      if (error instanceof z.ZodError) {
        // If validation fails, create an errors object
        const errors = error.errors.reduce((acc, err) => {
          // Use the 'path' property for the key and the message for the value
          const path = err.path.join("."); // Convert array path to string
          acc[path] = err.message;
          return acc;
        }, {});
        console.log(errors);

        dispatch({ type: "SET_FORM_ERRORS", payload: errors });
      } else {
        console.error("Unexpected error during validation", error);
      }
      return false;
    }
  }, [state, dispatch]);

  const isFieldRequired = useCallback(async (fieldPath) => {
    try {
      if (!fieldPath || typeof fieldPath !== "string") return;
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

  // Update form submission to include context state
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

export function useProductForm() {
  return useContext(ProductFormContext);
}

export default ProductFormProvider;
