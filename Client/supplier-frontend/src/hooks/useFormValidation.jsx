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

  // Validate a single field in the form
  const validateField = async (
    fieldPath,
    value,
    formState,
    shouldDispatchUpdates = true
  ) => {
    try {
      const fieldSchema = Yup.reach(formSchema, fieldPath);
      const parentPath = fieldPath.split(".").slice(0, -1).join(".");
      const parent = get(formState, parentPath);

      await fieldSchema.validate(value, {
        abortEarly: false,
        context: { uiState, parent },
      });

      if (shouldDispatchUpdates) {
        uiDispatch({
          type: "CLEAR_FIELD_ERROR",
          payload: fieldPath,
        });
      }

      return false; // No error
    } catch (error) {
      const errors = handleErrors(error, fieldPath);

      if (errors[fieldPath] === undefined) return;

      if (shouldDispatchUpdates) {
        uiDispatch({
          type: "SET_FIELD_ERROR",
          payload: { fieldPath, error: errors[fieldPath] },
        });
      }

      return true; // Error occurred
    }
  };

  // Validate the entire form
  const validateForm = async (formState) => {
    try {
      await formSchema.validate(formState, {
        abortEarly: false,
        context: { uiState },
      });
      uiDispatch({ type: "CLEAR_FORM_ERRORS" });
      return true; // Form is valid
    } catch (error) {
      const errors = handleErrors(error);
      uiDispatch({ type: "SET_FORM_ERRORS", payload: errors });
      return false; // Form is invalid
    }
  };

  return { validateForm, validateField };
};

export default useFormValidation;
