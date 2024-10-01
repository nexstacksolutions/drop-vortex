import * as Yup from "yup";
import { get } from "lodash";

// Helper function to transform value to a number and handle empty strings
const transformToNumber = (schema) =>
  schema.transform((value, originalValue) =>
    originalValue === "" ? null : Number(originalValue)
  );

// Helper function for required and nullable number/string
const requiredString = Yup.string().required("This field is required.");
const requiredNumber = transformToNumber(
  Yup.number()
    .positive("Must be a positive number.")
    .required("This field is required.")
);
const nullableString = Yup.string().nullable();
const nullableNumber = transformToNumber(Yup.number().nullable());

// File validation logic
const fileValidation = Yup.mixed().test(
  "file-validation",
  "Must be a valid file.",
  (value) => !value || value instanceof File
);

// Reusable array validation
const requiredArrayOfSchema = (
  schema,
  minItems = 1,
  errMsg = "This field is required."
) => Yup.array().of(schema).min(minItems, errMsg);

const nullableArrayOfSchema = (schema) => Yup.array().of(schema).nullable();

// Helper function for price comparison
const isCurrentLessThanOriginal = function (value) {
  const { original } = this.options.context.parent || this.parent;
  return original == null || value == null || value < original;
};

// Reusable pricing schema
const pricingSchema = Yup.object({
  current: transformToNumber(Yup.number())
    .nullable()
    .test(
      "is-current-greater-than-original",
      "Current price must be less than the original price.",
      isCurrentLessThanOriginal
    ),
  original: requiredNumber,
});

// Helper for handling measurement fields
const conditionalMeasurementField = (variantShipping, schema) =>
  transformToNumber(
    variantShipping
      ? schema.nullable()
      : schema.required("This field is required.").positive("Must be positive.")
  );

// Shipping dimensions schema
const dimensionFieldSchema = (name, variantShipping) =>
  Yup.number().when(variantShipping, (variantShipping, schema) =>
    conditionalMeasurementField(variantShipping, schema)
  );

const dimensionSchema = (variantShipping) =>
  Yup.object({
    length: dimensionFieldSchema("length", "$uiState.variantShipping"),
    width: dimensionFieldSchema("width", "$uiState.variantShipping"),
    height: dimensionFieldSchema("height", "$uiState.variantShipping"),
  }).when("$uiState.variantShipping", (variantShipping, schema) => {
    if (!variantShipping) {
      return schema.test(
        "dimensions-required",
        "All dimensions must be provided.",
        (value) => value && Object.values(value).every((v) => v)
      );
    }
    return schema;
  });

// Product form schema
const productFormSchema = Yup.object().shape({
  basicInfo: Yup.object({
    productName: requiredString,
    category: requiredString,
    media: Yup.object({
      productImages: requiredArrayOfSchema(fileValidation, 1),
      buyerPromotionImage: nullableArrayOfSchema(fileValidation),
      productVideo: nullableArrayOfSchema(
        Yup.mixed().test(
          "file-or-url",
          "Must be a valid file or URL.",
          (value) =>
            !value ||
            value instanceof File ||
            Yup.string().url("Invalid URL format").isValidSync(value)
        )
      ),
    }),
  }),

  productDetails: Yup.object({
    pricing: pricingSchema,

    stock: requiredNumber.min(0, "Stock cannot be negative."),
    availability: Yup.boolean().default(true),
    freeItems: nullableNumber,
    sku: nullableString,

    variations: requiredArrayOfSchema(
      Yup.object({
        type: requiredString,

        values: requiredArrayOfSchema(
          Yup.object({
            id: requiredString,
            name: requiredString,
            variantImages: nullableArrayOfSchema(fileValidation),

            pricing: pricingSchema,

            stock: requiredNumber,
            availability: Yup.boolean().default(true),
            freeItems: nullableString,
            sku: nullableString,

            packageWeight: Yup.number().when(
              "$uiState.variantShipping",
              (variantShipping, schema) =>
                conditionalMeasurementField(!variantShipping[0], schema)
            ),

            dimensions: dimensionSchema(),
          })
        ),
      })
    ),
  }),

  specifications: Yup.object({
    brand: Yup.object({
      name: requiredString,
      logo: nullableArrayOfSchema(fileValidation),
    }),
    numberOfPieces: requiredNumber.min(
      1,
      "Number of pieces must be at least 1."
    ),
    powerSource: requiredString,
    additionalSpecs: nullableArrayOfSchema(Yup.string()),
  }),

  description: Yup.object({
    main: requiredString,
    highlights: requiredString,
    tags: nullableArrayOfSchema(Yup.string()),
    whatsInBox: nullableString,
  }),

  shipping: Yup.object({
    packageWeight: Yup.number().when(
      "$uiState.variantShipping",
      (variantShipping, schema) =>
        conditionalMeasurementField(variantShipping[0], schema)
    ),
    dimensions: dimensionSchema(),
    dangerousGoods: nullableString,
    warranty: Yup.object({
      type: nullableString,
      period: nullableString,
      policy: nullableString,
    }),
  }),
});

export default productFormSchema;
