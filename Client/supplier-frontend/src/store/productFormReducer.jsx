import { produce } from "immer";
import { set } from "lodash";

const initialState = {
  basicInfo: {
    productName: "",
    category: "",
    media: {
      productImages: [],
      buyerPromotionImage: [],
      productVideo: [],
    },
  },
  productDetails: {
    pricing: { current: null, original: null }, // original required, current optional
    stock: null,
    availability: true,
    freeItems: null, // nullable
    sku: "", // nullable
    variations: [{ type: "Color Family", values: [] }],
  },
  specifications: {
    brand: { name: "", logo: [] },
    numberOfPieces: null,
    powerSource: "",
    additionalSpecs: [],
  },
  description: {
    main: "",
    highlights: "",
    tags: [],
    whatsInBox: "",
  },
  shipping: {
    packageWeight: null, // optional
    dimensions: { length: null, width: null, height: null }, // optional
    dangerousGoods: "None",
    warranty: { type: "", period: "", policy: "" },
  },
  uiState: {
    additionalFields: {
      warranty: false,
      additionalSpecs: false,
      description: false,
    },
    variantShipping: false,
    showVariantImages: true,
  },
  requiredFields: {},
  formErrors: {},
};

const productFormReducer = (state, action) =>
  produce(state, (draft) => {
    const { type, payload } = action;
    switch (type) {
      case "UPDATE_FIELD":
        set(draft, payload.name, payload.value);
        break;

      case "TOGGLE_ADDITIONAL_FIELDS":
        draft.uiState.additionalFields[payload.section] =
          !draft.uiState.additionalFields[payload.section];
        break;

      case "TOGGLE_VARIANT_SHIPPING":
        draft.uiState.variantShipping = !draft.uiState.variantShipping;
        break;

      case "SET_VARIANT_SHIPPING_FALSE":
        draft.uiState.variantShipping = false;
        break;

      case "ADD_VARIANT_ITEM":
        draft.productDetails.variations[payload.variationIndex].values.push(
          payload.newVariant
        );
        break;

      case "REMOVE_VARIANT_ITEM":
        draft.productDetails.variations[payload.variationIndex].values.splice(
          payload.valueIndex,
          1
        );
        break;

      case "APPLY_TO_ALL_VARIANTS":
        draft.productDetails.variations.forEach((variation) => {
          variation.values.forEach((value) => {
            value.pricing.current =
              payload.pricing.current || value.pricing.current;
            value.pricing.original =
              payload.pricing.original || value.pricing.original;
            value.stock = payload.stock || value.stock;
            value.sku = payload.sku || value.sku;
          });
        });
        break;

      // New Cases for formErrors and requiredFields
      case "SET_REQUIRED_FIELDS":
        draft.requiredFields = payload;
        break;

      case "SET_FORM_ERRORS":
        draft.formErrors = payload;
        break;

      case "CLEAR_FORM_ERRORS":
        draft.formErrors = {};
        break;

      default:
        break;
    }
  });

export { initialState, productFormReducer };
