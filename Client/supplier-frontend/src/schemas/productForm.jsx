import * as Yup from "yup";

// Reusable validation for required and nullable fields
const requiredString = Yup.string().required("The field value is required");
const requiredNumber = Yup.number()
  .transform((value, originalValue) =>
    originalValue === "" ? null : Number(originalValue)
  )
  .positive("Must be a positive number")
  .required("The field value is required");

const nullableString = Yup.string().nullable();
const nullableNumber = Yup.number()
  .transform((value, originalValue) =>
    originalValue === "" ? null : Number(originalValue)
  )
  .positive("Must be a positive number")
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

const measurementSchema = (variantShipping, schema) => {
  const isVariantShipping = variantShipping[0];

  return !isVariantShipping
    ? schema
        .transform((_, originalValue) =>
          originalValue === "" ? null : Number(originalValue)
        )
        .required("the field value is required")
        .positive("Must be a positive number")
    : schema
        .transform((_, originalValue) =>
          originalValue === "" ? null : Number(originalValue)
        )
        .nullable();
};

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
      productVideo: nullableArray.of(
        Yup.mixed().test(
          "file-or-url",
          "Must be either a file or a valid URL",
          (value) => {
            if (!value) return true; // No validation if value is empty
            return (
              value instanceof File ||
              Yup.string().url("Invalid URL format").isValidSync(value)
            );
          }
        )
      ),
    }),
  }),

  productDetails: Yup.object({
    pricing: Yup.object({
      current: nullableNumber.when("original", (original, schema) =>
        original
          ? schema.max(
              original,
              "Current price (special price) must be less than original price"
            )
          : schema
      ),
      original: requiredNumber,
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
      logo: nullableArray.of(fileValidation),
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
    packageWeight: Yup.number().when(
      "$uiState.variantShipping",
      (variantShipping, schema) => measurementSchema(variantShipping, schema)
    ),

    dimensions: Yup.object({
      length: Yup.number().when(
        "$uiState.variantShipping",
        (variantShipping, schema) => measurementSchema(variantShipping, schema)
      ),
      width: Yup.number().when(
        "$uiState.variantShipping",
        (variantShipping, schema) => measurementSchema(variantShipping, schema)
      ),
      height: Yup.number().when(
        "$uiState.variantShipping",
        (variantShipping, schema) => measurementSchema(variantShipping, schema)
      ),
    }).when("$uiState.variantShipping", (variantShipping, schema) => {
      // Extract the first value from the array
      const isVariantShipping = variantShipping[0];

      return !isVariantShipping
        ? schema.test(
            "dimensions-required",
            "All dimensions must be provided",
            function (value) {
              return Object.values(value || {}).every((v) => v);
            }
          )
        : schema;
    }),
    dangerousGoods: nullableString,
    warranty: Yup.object({
      type: nullableString,
      period: nullableString,
      policy: nullableString,
    }),
  }),
});

export default productFormSchema;
