import * as Yup from "yup";

const useFormValidation = (schema, dispatch) => {
  const handleErrors = (error, fallbackPath) => {
    return error.inner.reduce((acc, err) => {
      const path = err.path || fallbackPath;
      acc[path] = err.message;
      return acc;
    }, {});
  };

  const validateField = async (fieldPath, value) => {
    try {
      const fieldSchema = Yup.reach(schema, fieldPath);
      await fieldSchema.validate(value, { abortEarly: false });

      dispatch({
        type: "CLEAR_FIELD_ERROR",
        payload: fieldPath,
      });

      return {};
    } catch (error) {
      const errors = handleErrors(error, fieldPath);
      dispatch({
        type: "SET_FIELD_ERROR",
        payload: { fieldPath, error: errors[fieldPath] },
      });
      console.log(errors);

      return errors;
    }
  };

  const validateForm = async (state) => {
    try {
      await schema.validate(state, { abortEarly: false });
      dispatch({ type: "CLEAR_FORM_ERRORS" });
      return true;
    } catch (error) {
      const errors = handleErrors(error);
      dispatch({ type: "SET_FORM_ERRORS", payload: errors });
      return false;
    }
  };

  return { validateForm, validateField };
};

export default useFormValidation;
