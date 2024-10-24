// Form State Action Types
export const UPDATE_FIELD = "UPDATE_FIELD";
export const APPLY_TO_ALL_VARIANTS = "APPLY_TO_ALL_VARIANTS";

// Form UI Action Types
export const TOGGLE_ADDITIONAL_FIELDS = "TOGGLE_ADDITIONAL_FIELDS";
export const TOGGLE_VARIANT_SHIPPING = "TOGGLE_VARIANT_SHIPPING";
export const TOGGLE_VARIANT_VALUES = "TOGGLE_VARIANT_VALUES";
export const SET_REQUIRED_FIELDS = "SET_REQUIRED_FIELDS";
export const SET_FORM_ERRORS = "SET_FORM_ERRORS";
export const CLEAR_FORM_ERRORS = "CLEAR_FORM_ERRORS";
export const SET_EMPTY_FIELDS = "SET_EMPTY_FIELDS";
export const CLEAR_EMPTY_FIELDS = "CLEAR_EMPTY_FIELDS";
export const SET_FIELD_ERROR = "SET_FIELD_ERROR";
export const CLEAR_FIELD_ERROR = "CLEAR_FIELD_ERROR";
export const SET_IS_SUBMITTING = "SET_IS_SUBMITTING";

// Form State Actions
const formActions = {
  updateField: (payload) => ({
    type: UPDATE_FIELD,
    payload,
  }),

  applyToAllVariants: (payload) => ({
    type: APPLY_TO_ALL_VARIANTS,
    payload,
  }),
};

// Form UI Actions
const formUIActions = {
  toggleAdditionalFields: (payload) => ({
    type: TOGGLE_ADDITIONAL_FIELDS,
    payload,
  }),

  toggleVariantShipping: (payload) => ({
    type: TOGGLE_VARIANT_SHIPPING,
    payload,
  }),

  toggleVariantValues: (payload) => ({
    type: TOGGLE_VARIANT_VALUES,
    payload,
  }),

  setRequiredFields: (payload) => ({
    type: SET_REQUIRED_FIELDS,
    payload,
  }),

  setFormErrors: (payload) => ({
    type: SET_FORM_ERRORS,
    payload,
  }),

  setEmptyFields: (payload) => ({
    type: SET_EMPTY_FIELDS,
    payload,
  }),

  clearEmptyFields: (payload) => ({
    type: CLEAR_EMPTY_FIELDS,
    payload,
  }),

  clearFormErrors: () => ({
    type: CLEAR_FORM_ERRORS,
  }),

  clearFieldError: (payload) => ({
    type: CLEAR_FIELD_ERROR,
    payload,
  }),

  setFieldError: (payload) => ({
    type: SET_FIELD_ERROR,
    payload,
  }),

  setIsSubmitting: (payload) => ({
    type: SET_IS_SUBMITTING,
    payload,
  }),
};

// Exporting Actions
export { formActions, formUIActions };
