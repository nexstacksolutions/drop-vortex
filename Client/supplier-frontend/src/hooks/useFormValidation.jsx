import * as Yup from "yup";
import { get } from "lodash";

const useFormValidation = (formSchema, uiState, uiDispatch) => {
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

  const validateField = async (fieldPath, value, formState) => {
    try {
      const fieldSchema = Yup.reach(formSchema, fieldPath);
      const parentPath = fieldPath.split(".").slice(0, -1).join(".");
      const parent = get(formState, parentPath);

      await fieldSchema.validate(value, {
        abortEarly: false,
        context: { uiState, parent },
      });

      uiDispatch({
        type: "CLEAR_FIELD_ERROR",
        payload: fieldPath,
      });

      return {};
    } catch (error) {
      const errors = handleErrors(error, fieldPath);
      if (errors[fieldPath] === undefined) return;

      uiDispatch({
        type: "SET_FIELD_ERROR",
        payload: { fieldPath, error: errors[fieldPath] },
      });

      return errors;
    }
  };

  const validateForm = async (formState) => {
    try {
      await formSchema.validate(formState, {
        abortEarly: false,
        context: { uiState },
      });
      uiDispatch({ type: "CLEAR_FORM_ERRORS" });
      return true;
    } catch (error) {
      const errors = handleErrors(error);
      uiDispatch({ type: "SET_FORM_ERRORS", payload: errors });
      return false;
    }
  };

  return { validateForm, validateField };
};

export default useFormValidation;
