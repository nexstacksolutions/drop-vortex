import { set } from "lodash";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";

const initialFormState = {
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
    pricing: {
      original: {
        amount: "",
        currency: "PKR",
      },
      special: { amount: "", start: "", end: "", discount: "", status: false },
      priceFormat: {
        decimals: 2,
        separator: ",",
      },
    },
    stock: "",
    availability: true,
    freeItems: "",
    sku: "",
    variations: [{ type: "Color Family", values: [] }],
  },
  specifications: {
    brand: { name: "", logo: [] },
    numberOfPieces: "",
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
    packageWeight: { value: "", unit: "kg" },
    dimensions: { length: "", width: "", height: "" },
    dangerousGoods: "None",
    warranty: { type: "", period: "", policy: "" },
  },
};

const createNewVariant = (inputValue, variantImages = []) => ({
  id: uuidv4(),
  name: inputValue,
  variantImages,
  pricing: initialFormState.productDetails.pricing,
  stock: initialFormState.productDetails.stock,
  availability: true,
  freeItems: "",
  sku: "",
  packageWeight: initialFormState.shipping.packageWeight,
  dimensions: initialFormState.shipping.dimensions,
});

const formControl = (state, action) =>
  produce(state, (draft) => {
    const { type, payload } = action;
    switch (type) {
      case "UPDATE_FIELD":
        set(draft, payload.name, payload.value);
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

      default:
        break;
    }
  });

export { initialFormState, createNewVariant, formControl };
