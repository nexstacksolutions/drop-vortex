const useFormValidation = (schema, dispatch) => {
  const handleValidationError = (error) => {
    const errors = error.inner.reduce((acc, err) => {
      acc[err.path] = err.message;
      return acc;
    }, {});
    dispatch({ type: "SET_FORM_ERRORS", payload: errors });
  };

  const validateForm = async (state) => {
    try {
      await schema.validate(state, { abortEarly: false });
      dispatch({ type: "CLEAR_FORM_ERRORS" });
      return true;
    } catch (error) {
      handleValidationError(error);
      return false;
    }
  };

  return { validateForm };
};

export default useFormValidation;
