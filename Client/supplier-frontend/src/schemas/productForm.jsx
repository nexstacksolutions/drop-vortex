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
const nullableNumber = transformToNumber(
  Yup.number().positive("Must be a positive number.").nullable()
);

// File validation logic
const fileValidation = Yup.mixed().test(
  "is-file",
  "Must be a valid file.",
  (value) => value instanceof File
);

// Reusable array validation
const requiredArray = (minItems = 1, errMsg = "This field is required.") =>
  Yup.array().min(minItems, errMsg);
const nullableArray = Yup.array().nullable();
const nullableArrayOfString = Yup.array().of(Yup.string()).nullable();

// Helper for handling measurement fields
// Helper for handling measurement fields
const conditionalMeasurementField = (variantShipping, schema) =>
  transformToNumber(
    variantShipping[0]
      ? schema.nullable()
      : schema.required("This field is required.").positive("Must be positive.")
  );

// Shipping dimensions schema
const dimensionSchema = () =>
  Yup.object({
    length: Yup.number().when(
      "$uiState.variantShipping",
      (variantShipping, schema) =>
        conditionalMeasurementField(variantShipping, schema)
    ),
    width: Yup.number().when(
      "$uiState.variantShipping",
      (variantShipping, schema) =>
        conditionalMeasurementField(variantShipping, schema)
    ),
    height: Yup.number().when(
      "$uiState.variantShipping",
      (variantShipping, schema) =>
        conditionalMeasurementField(variantShipping, schema)
    ),
  }).when("$uiState.variantShipping", (variantShipping, schema) => {
    if (!variantShipping[0]) {
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
      productImages: requiredArray(
        1,
        "Image is required. Please upload at least one image."
      ).of(fileValidation),
      buyerPromotionImage: nullableArray.of(fileValidation),
      productVideo: nullableArray.of(
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
    pricing: Yup.object({
      current: transformToNumber(Yup.number())
        .nullable()
        .test(
          "is-current-greater-than-original",
          "Current price must be less than the original price.",
          function (value) {
            let { parent } = this.options.context;
            parent = parent ? parent : this.parent;

            console.log("schema: ", parent);
            const original = parent ? parent.original : null;
            return original == null || original == "" || value < original;
          }
        ),
      original: requiredNumber,
    }),

    stock: requiredNumber.min(0, "Stock cannot be negative."),
    availability: Yup.boolean().default(true),
    freeItems: nullableNumber,
    sku: nullableString,

    variations: Yup.array()
      .of(
        Yup.object({
          type: requiredString,

          values: Yup.array()
            .of(
              Yup.object({
                id: requiredString,
                name: requiredString,
                variantImages: nullableArray.of(fileValidation),

                pricing: Yup.object({
                  current: transformToNumber(Yup.number())
                    .nullable()
                    .test(
                      "is-current-greater-than-original",
                      "Current price must be less than the original price.",
                      function (value) {
                        let { parent } = this.options.context;
                        parent = parent ? parent : this.parent;

                        console.log("schema: ", parent);
                        const original = parent ? parent.original : null;
                        return (
                          original == null || original == "" || value < original
                        );
                      }
                    ),
                  original: requiredNumber,
                }),

                stock: requiredNumber,
                availability: Yup.boolean().default(true),
                freeItems: nullableString,
                sku: nullableString,

                packageWeight: Yup.number().when(
                  "$uiState.variantShipping",
                  (variantShipping, schema) =>
                    conditionalMeasurementField(variantShipping, schema)
                ),

                dimensions: dimensionSchema(),
              })
            )
            .required("Each variation must have at least one variant.")
            .min(1, "Each variation must have at least one variant."),
        })
      )
      .required("At least one variation is required.")
      .min(1, "At least one variation must be provided."),
  }),

  specifications: Yup.object({
    brand: Yup.object({
      name: requiredString,
      logo: nullableArray.of(fileValidation),
    }),
    numberOfPieces: requiredNumber.min(
      1,
      "Number of pieces must be at least 1."
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
      (variantShipping, schema) =>
        conditionalMeasurementField(variantShipping, schema)
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
