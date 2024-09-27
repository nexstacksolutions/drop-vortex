import * as Yup from "yup";
import debounce from "lodash/debounce";
import { v4 as uuidv4 } from "uuid";
// import formSections from "../../../../constant/formSections";
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
  const [requiredFields, setRequiredFields] = useState({});
  const [formErrors, setFormErrors] = useState({});

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
      setFormErrors({});
      return true;
    } catch (error) {
      const errors = error.inner.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      setFormErrors(errors);
      return false;
    }
  }, [state]);

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

  // useEffect(() => {
  //   const fetchRequiredFields = async () => {
  //     let requiredFieldStatuses = {};

  //     await Promise.all(
  //       formSections.map(async (section) => {
  //         await Promise.all(
  //           section.fields.map(async (field) => {
  //             const isRequired = await isFieldRequired(field?.name);
  //             if (isRequired === undefined) return;
  //             requiredFieldStatuses[field.name] = isRequired;
  //           })
  //         );
  //       })
  //     );

  //     setRequiredFields(requiredFieldStatuses);
  //   };

  //   fetchRequiredFields();
  // }, [isFieldRequired]);

  // In your useEffect
  useEffect(() => {
    if (!multiVariantShippingCondition) {
      dispatch({ type: "SET_VARIANT_SHIPPING_FALSE" });
    }
  }, [multiVariantShippingCondition, dispatch]);

  const values = useMemo(
    () => ({
      state,
      dispatch,
      requiredFields,
      formErrors,
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
      requiredFields,
      formErrors,
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
