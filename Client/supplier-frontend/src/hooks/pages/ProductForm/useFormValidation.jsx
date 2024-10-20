import * as Yup from "yup";
import { get } from "lodash";

// Custom hook for form validation
const useFormValidation = (formSchema, uiState, uiDispatch) => {
  // Handle validation errors from Yup
  const handleErrors = (error, fallbackPath) => {
    return error.inner.reduce((acc, err) => {
      let path = err.path || fallbackPath;
      if (path.startsWith("[") || path.startsWith(".")) {
        path = `${fallbackPath}${path}`;
      }
      acc[path] = err.message;
      return acc;
    }, {});
  };

  // Validate a single field in the form on change input
  const validateField = async (formState, fieldPath, fieldValue) => {
    try {
      const fieldSchema = Yup.reach(formSchema, fieldPath);
      const sliceDepth = fieldPath.includes("productDetails.pricing") ? -2 : -1;
      const parentPath = fieldPath.split(".").slice(0, sliceDepth).join(".");
      const parent = get(formState, parentPath);
      const updatedValue =
        fieldValue !== undefined ? fieldValue : get(formState, fieldPath);

      await fieldSchema.validate(updatedValue, {
        abortEarly: false,
        context: { uiState, parent },
      });

      uiDispatch({
        type: "CLEAR_FIELD_ERROR",
        payload: fieldPath,
      });

      return false; // No error
    } catch (error) {
      const errors = handleErrors(error, fieldPath);
      if (errors[fieldPath] === undefined) return false;

      uiDispatch({
        type: "SET_FIELD_ERROR",
        payload: { fieldPath, error: errors[fieldPath] },
      });

      return true; // Error occurred
    }
  };

  // Validate the entire form
  const validateForm = async (
    formState,
    additionalUpdate = false,
    dispatchType
  ) => {
    try {
      await formSchema.validate(formState, {
        abortEarly: false,
        context: { uiState },
      });
      uiDispatch({ type: "CLEAR_FORM_ERRORS" });
      return true; // Form is valid
    } catch (error) {
      const errors = handleErrors(error);

      if (additionalUpdate) {
        uiDispatch({ type: dispatchType, payload: errors });
      } else {
        uiDispatch({ type: "SET_FORM_ERRORS", payload: errors });
      }
      return false;
    }
  };

  return { validateForm, validateField };
};

export default useFormValidation;
