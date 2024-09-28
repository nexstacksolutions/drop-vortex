import * as Yup from "yup";

// Reusable validation for required and nullable fields
const requiredString = Yup.string().required("The field value is required");
const requiredNumber = Yup.number()
  .transform((value, originalValue) =>
    originalValue === "" ? null : Number(originalValue)
  )
  .required("The field value is required")
  .positive("Must be a positive number");

const nullableString = Yup.string().nullable();
const nullableNumber = Yup.number()
  .transform((value, originalValue) =>
    originalValue === "" ? null : Number(originalValue)
  )
  .nullable();

const requiredArray = (minItems = 1, errMsg = "") =>
  Yup.array().min(minItems, `The field value is required ${errMsg}`);
const nullableArray = Yup.array().nullable();
const nullableArrayOfString = Yup.array().of(Yup.string()).nullable();

const fileValidation = Yup.mixed().test(
  "is-file",
  "Must be a file",
  (value) => {
    return value instanceof File;
  }
);

const productFormSchema = Yup.object().shape({
  basicInfo: Yup.object({
    productName: requiredString,
    category: requiredString,
    media: Yup.object({
      productImages: requiredArray(
        1,
        ", Image is missing. Please upload at least 1 image."
      ).of(fileValidation),
      buyerPromotionImage: nullableArray.of(fileValidation),
      productVideo: nullableArray.of(fileValidation),
    }),
  }),

  productDetails: Yup.object({
    pricing: Yup.object({
      current: nullableNumber,
      original: requiredNumber.moreThan(
        Yup.ref("current"),
        "Original price must be greater than current price"
      ),
    }),
    stock: requiredNumber.min(0, "Stock cannot be negative"),
    availability: Yup.boolean(),
    freeItems: nullableNumber,
    sku: nullableString,
    variations: Yup.array()
      .of(
        Yup.object({
          type: requiredString,
          values: requiredArray(1).test(
            "at-least-one-object",
            "Each variation must have at least one variant",
            (values) => values && values.length > 0
          ),
        })
      )
      .required("At least one variation is required"),
  }).test(
    "at-least-one-variation",
    "At least one variation must be provided if variations are specified",
    function (value) {
      return !(value?.variations?.length === 0);
    }
  ),

  specifications: Yup.object({
    brand: Yup.object({
      name: requiredString,
      logo: Yup.mixed()
        .test(
          "url-or-file",
          "Brand logo must be a valid URL or a file",
          (value) => {
            // Check if the value is a URL
            const isValidUrl = Yup.string().url().isValidSync(value);

            // Check if the value is a File object (assuming it's being uploaded from a form)
            const isValidFile = value instanceof File;

            return isValidUrl || isValidFile;
          }
        )
        .nullable(),
    }),
    numberOfPieces: requiredNumber.min(
      1,
      "Number of pieces must be at least 1"
    ),
    powerSource: requiredString,
    additionalSpecs: nullableArrayOfString,
  }),

  description: Yup.object({
    main: requiredString,
    highlights: requiredString,
    tags: nullableArrayOfString,
    whatsInBox: nullableString,
  }),

  shipping: Yup.object({
    packageWeight: requiredNumber,
    dimensions: Yup.object({
      length: requiredNumber,
      width: requiredNumber,
      height: requiredNumber,
    }).test(
      "dimensions-required",
      "All dimensions must be provided",
      function (value) {
        return Object.values(value || {}).every((v) => v);
      }
    ),
    dangerousGoods: nullableString,
    warranty: Yup.object({
      type: nullableString,
      period: nullableString,
      policy: nullableString,
    }),
  }),

  uiState: Yup.object({
    additionalFields: Yup.object({
      warranty: Yup.boolean(),
      additionalSpecs: Yup.boolean(),
      description: Yup.boolean(),
    }),
    variantShipping: Yup.boolean(),
  }),
});

export default productFormSchema;
