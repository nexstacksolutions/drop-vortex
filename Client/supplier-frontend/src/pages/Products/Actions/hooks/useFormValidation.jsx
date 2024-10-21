import * as Yup from "yup";
import { get } from "lodash";
import { formUIActions } from "../../../../store/productForm/actions";

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
      const sliceDepth = fieldPath.includes(".pricing") ? -2 : -1;
      const parentPath = fieldPath.split(".").slice(0, sliceDepth).join(".");
      const parent = get(formState, parentPath);
      const updatedValue =
        fieldValue !== undefined ? fieldValue : get(formState, fieldPath);

      await fieldSchema.validate(updatedValue, {
        abortEarly: false,
        context: { uiState, parent },
      });

      uiDispatch(formUIActions.clearFieldError(fieldPath));

      return false; // No error
    } catch (error) {
      const errors = handleErrors(error, fieldPath);
      if (errors[fieldPath] === undefined) return false;

      uiDispatch(
        formUIActions.setFieldError({ fieldPath, error: errors[fieldPath] })
      );

      return true; // Error occurred
    }
  };

  // Validate the entire form
  const validateForm = async (formState, additionalUpdate) => {
    try {
      await formSchema.validate(formState, {
        abortEarly: false,
        context: { uiState },
      });
      uiDispatch(formUIActions.clearFormErrors());
      return true; // Form is valid
    } catch (error) {
      const errors = handleErrors(error);

      if (additionalUpdate) {
        uiDispatch(additionalUpdate(errors));
      } else {
        uiDispatch(formUIActions.setFormErrors(errors));
      }
      return false;
    }
  };

  return { validateForm, validateField };
};

export default useFormValidation;
