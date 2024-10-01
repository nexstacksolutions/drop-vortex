import * as Yup from "yup";

const useFormValidation = (formSchema, uiState, uiDispatch) => {
  const handleErrors = (error, fallbackPath) => {
    return error.inner.reduce((acc, err) => {
      const path = err.path || fallbackPath;
      acc[path] = err.message;
      return acc;
    }, {});
  };

  const validateField = async (fieldPath, value) => {
    try {
      const fieldSchema = Yup.reach(formSchema, fieldPath);
      await fieldSchema.validate(value, {
        abortEarly: false,
        context: { uiState },
      });

      uiDispatch({
        type: "CLEAR_FIELD_ERROR",
        payload: fieldPath,
      });

      return {};
    } catch (error) {
      const errors = handleErrors(error, fieldPath);
      uiDispatch({
        type: "SET_FIELD_ERROR",
        payload: { fieldPath, error: errors[fieldPath] },
      });
      console.log(errors);

      return errors;
    }
  };

  const validateForm = async (state) => {
    try {
      await formSchema.validate(state, {
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
