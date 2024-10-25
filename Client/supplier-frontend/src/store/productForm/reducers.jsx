import { set } from "lodash";
import { produce } from "immer";
import {
  UPDATE_FIELD,
  APPLY_TO_ALL_VARIANTS,
  TOGGLE_ADDITIONAL_FIELDS,
  TOGGLE_VARIANT_SHIPPING,
  TOGGLE_VARIANT_VALUES,
  SET_REQUIRED_FIELDS,
  SET_FORM_ERRORS,
  SET_EMPTY_FIELDS,
  CLEAR_EMPTY_FIELDS,
  CLEAR_FORM_ERRORS,
  CLEAR_FIELD_ERROR,
  SET_FIELD_ERROR,
  SET_IS_SUBMITTING,
} from "./actions";

function formControl(state, action) {
  return produce(state, (draft) => {
    const { type, payload } = action;
    switch (type) {
      case UPDATE_FIELD:
        set(draft, payload.name, payload.value);
        break;

      case APPLY_TO_ALL_VARIANTS:
        draft.productDetails.variations.forEach((variation) => {
          variation.values.forEach((value) => {
            value.pricing.special.amount =
              payload.pricing.special.amount || value.pricing.special.amount;
            value.pricing.original.amount =
              payload.pricing.original.amount || value.pricing.original.amount;
            value.stock = payload.stock || value.stock;
            value.sku = payload.sku || value.sku;
          });
        });
        break;

      default:
        break;
    }
  });
}

function formUIControl(state, action) {
  return produce(state, (draft) => {
    const { type, payload } = action;

    switch (type) {
      case TOGGLE_ADDITIONAL_FIELDS:
        {
          const { section, forceClose } = payload;
          draft.additionalFields[section] = !forceClose
            ? !draft.additionalFields[section]
            : false;
        }
        break;

      case TOGGLE_VARIANT_SHIPPING:
        draft.variantShipping = !payload ? !draft.variantShipping : false;
        break;

      case TOGGLE_VARIANT_VALUES:
        draft.variantValues = payload;
        break;

      case SET_REQUIRED_FIELDS:
        draft.requiredFields = payload;
        draft.emptyFields = payload;
        break;

      case SET_FORM_ERRORS:
        draft.formErrors = payload;
        break;

      case CLEAR_FORM_ERRORS:
        draft.formErrors = {};
        break;

      case SET_EMPTY_FIELDS:
        draft.emptyFields = { ...draft.emptyFields, ...payload };
        break;

      case CLEAR_EMPTY_FIELDS:
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

      case SET_FIELD_ERROR: {
        const { fieldPath, error } = payload;
        draft.formErrors[fieldPath] = error;
        draft.emptyFields[fieldPath] = true;
        break;
      }

      case CLEAR_FIELD_ERROR:
        delete draft.formErrors[payload];
        draft.emptyFields[payload] = false;
        break;

      case SET_IS_SUBMITTING:
        draft.isSubmitting = payload;
        break;

      default:
        break;
    }
  });
}

export { formControl, formUIControl };
