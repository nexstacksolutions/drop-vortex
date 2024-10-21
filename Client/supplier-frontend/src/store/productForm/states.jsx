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
      special: { amount: "", start: "", end: "", discount: "", status: "" },
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

const initialFormUIState = {
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

export { initialFormState, initialFormUIState };
