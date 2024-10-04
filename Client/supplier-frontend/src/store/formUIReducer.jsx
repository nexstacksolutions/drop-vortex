import { produce } from "immer";

const formUI = {
  additionalFields: {
    warranty: false,
    additionalSpecs: false,
    description: false,
  },
  variantShipping: false,
  showVariantImages: true,
  formErrors: {},
  emptyFields: {},
  requiredFields: {},
  isSubmitting: false,
  isSubmitted: false,
};

const uiControl = (state, action) =>
  produce(state, (draft) => {
    const { type, payload } = action;
    switch (type) {
      case "TOGGLE_ADDITIONAL_FIELDS":
        draft.additionalFields[payload.section] =
          !draft.additionalFields[payload.section];
        break;

      case "TOGGLE_VARIANT_SHIPPING":
        draft.variantShipping = !draft.variantShipping;
        break;

      case "SET_VARIANT_SHIPPING_FALSE":
        draft.variantShipping = false;
        break;

      case "SET_REQUIRED_FIELDS":
        draft.requiredFields = payload;
        break;

      case "SET_FORM_ERRORS":
        draft.formErrors = payload;
        break;

      case "SET_EMPTY_FIELDS":
        draft.emptyFields = Object.keys(payload);
        break;

      case "CLEAR_FORM_ERRORS":
        draft.formErrors = {};
        break;

      case "CLEAR_FIELD_ERROR":
        delete draft.formErrors[payload];
        break;

      case "SET_FIELD_ERROR":
        {
          const { fieldPath, error } = payload;
          draft.formErrors[fieldPath] = error;
        }
        break;

      case "SET_IS_SUBMITTING":
        draft.isSubmitting = payload;
        break;

      default:
        break;
    }
  });

export { formUI, uiControl };
