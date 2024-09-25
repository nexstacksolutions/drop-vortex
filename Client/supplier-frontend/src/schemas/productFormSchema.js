import * as Yup from "yup";

const productFormSchema = Yup.object().shape({
  basicInfo: Yup.object().shape({
    productName: Yup.string()
      .required("Product Name is required")
      .max(255, "Product Name cannot exceed 255 characters"),
    category: Yup.string().required("Category is required"),
    media: Yup.object().shape({
      productImages: Yup.array().min(
        1,
        "At least one product image is required"
      ),
      buyerPromotionImage: Yup.array().min(
        1,
        "Buyer promotion image is required"
      ),
      productVideo: Yup.array().max(1, "Only one product video is allowed"),
    }),
  }),
  productDetails: Yup.object().shape({
    pricing: Yup.object().shape({
      current: Yup.number()
        .required("Current price is required")
        .positive("Current price must be a positive number"),
      original: Yup.number()
        .required("Original price is required")
        .positive("Original price must be a positive number")
        .moreThan(
          Yup.ref("current"),
          "Original price must be greater than current price"
        ),
    }),
    stock: Yup.number()
      .required("Stock is required")
      .min(0, "Stock cannot be negative"),
    availability: Yup.boolean(),
    freeItems: Yup.number().nullable().min(0, "Free items cannot be negative"),
    sku: Yup.string().required("SKU is required"),
    variations: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required("Variation type is required"),
        values: Yup.array().min(1, "At least one variation value is required"),
      })
    ),
  }),
  specifications: Yup.object().shape({
    brand: Yup.object().shape({
      name: Yup.string().required("Brand name is required"),
      logo: Yup.string().url("Brand logo must be a valid URL").nullable(),
    }),
    numberOfPieces: Yup.number()
      .required("Number of pieces is required")
      .min(1, "Number of pieces must be at least 1"),
    powerSource: Yup.string().nullable(),
    additionalSpecs: Yup.array().of(Yup.string()).nullable(),
  }),
  description: Yup.object().shape({
    main: Yup.string().required("Main description is required"),
    highlights: Yup.string().nullable(),
    tags: Yup.array().of(Yup.string()).nullable(),
    whatsInBox: Yup.string().required("What's in the box is required"),
  }),
  shipping: Yup.object().shape({
    packageWeight: Yup.number()
      .required("Package weight is required")
      .positive("Package weight must be a positive number"),
    dimensions: Yup.object().shape({
      length: Yup.number()
        .required("Length is required")
        .positive("Length must be a positive number"),
      width: Yup.number()
        .required("Width is required")
        .positive("Width must be a positive number"),
      height: Yup.number()
        .required("Height is required")
        .positive("Height must be a positive number"),
    }),
    dangerousGoods: Yup.string().nullable(),
    warranty: Yup.object().shape({
      type: Yup.string().nullable(),
      period: Yup.string().nullable(),
      policy: Yup.string().nullable(),
    }),
  }),
  uiState: Yup.object().shape({
    additionalFields: Yup.object().shape({
      warranty: Yup.boolean(),
      additionalSpecs: Yup.boolean(),
      description: Yup.boolean(),
    }),
    variantShipping: Yup.boolean(),
  }),
});

export default productFormSchema;
