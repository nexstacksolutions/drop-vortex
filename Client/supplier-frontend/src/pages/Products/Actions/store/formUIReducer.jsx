import { produce } from "immer";

const initialFormUI = {
  additionalFields: {
    warranty: false,
    additionalSpecs: false,
    description: false,
    productDetails: false,
  },
  variantShipping: false,
  variantValues: false,
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
        draft.additionalFields[payload] = !draft.additionalFields[payload];
        break;

      case "TOGGLE_VARIANT_SHIPPING":
        draft.variantShipping = !draft.variantShipping;
        break;

      case "TOGGLE_VARIANT_VALUES":
        draft.variantValues = payload;
        break;

      case "SET_VARIANT_SHIPPING_FALSE":
        draft.variantShipping = false;
        break;

      case "SET_REQUIRED_FIELDS":
        draft.requiredFields = payload;
        draft.emptyFields = payload;
        break;

      case "SET_FORM_ERRORS":
        draft.formErrors = payload;
        break;

      case "SET_EMPTY_FIELDS":
        draft.emptyFields = { ...draft.emptyFields, ...payload };

        break;

      case "CLEAR_EMPTY_FIELDS":
        draft.emptyFields = Object.keys(draft.emptyFields).reduce(
          (acc, key) => {
            const matches = key.match(
              /productDetails\.variations\[(\d+)\]\.values\[(\d+)\](.*)/
            );

            if (matches) {
              const [fullKey, variationIndex, valueIndex] = matches;
              const currentIndex = parseInt(valueIndex);

              if (currentIndex > payload.removedIndex) {
                const newKey = `productDetails.variations[${variationIndex}].values[${
                  currentIndex - 1
                }]${matches[3]}`;
                acc[newKey] = draft.emptyFields[fullKey];
              }
            } else {
              acc[key] = draft.emptyFields[key];
            }

            return acc;
          },
          {}
        );
        break;

      case "CLEAR_FORM_ERRORS":
        draft.formErrors = {};
        break;

      case "CLEAR_FIELD_ERROR":
        delete draft.formErrors[payload];
        draft.emptyFields[payload] = false;
        break;

      case "SET_FIELD_ERROR":
        {
          const { fieldPath, error } = payload;
          draft.formErrors[fieldPath] = error;
          draft.emptyFields[fieldPath] = true;
        }
        break;

      case "SET_IS_SUBMITTING":
        draft.isSubmitting = payload;
        break;

      default:
        break;
    }
  });

export { initialFormUI, uiControl };
