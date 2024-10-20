// validationHelpers.js
import * as Yup from "yup";

// Helper function to transform value to a number and handle empty strings
export const transformToNumber = (schema) =>
  schema.transform((value, originalValue) =>
    originalValue === "" ? null : Number(originalValue)
  );

// Helper function for required and nullable number/string
export const requiredString = Yup.string().required("This field is required.");
export const requiredNumber = transformToNumber(
  Yup.number()
    .positive("Must be a positive number.")
    .required("This field is required.")
);
export const nullableString = Yup.string().nullable();
export const nullableNumber = transformToNumber(
  Yup.number().positive("Must be a positive number.").nullable()
);

// File validation logic
export const fileValidation = Yup.mixed().test(
  "file-validation",
  "Must be a valid file.",
  (value) => !value || value instanceof File
);

// Allow file array or a URL string
export const fileOrUrlValidation = Yup.mixed().test(
  "file-or-url",
  "Must be an array of files or a valid URL.",
  (value) =>
    !value ||
    (Array.isArray(value) && value.every((file) => file instanceof File)) ||
    Yup.string().url("Invalid URL format").isValidSync(value)
);

// Reusable array validation
export const requiredArrayOfSchema = (
  schema,
  minItems = 1,
  errMsg = "This field is required."
) => Yup.array().of(schema).min(minItems, errMsg);

export const nullableArrayOfSchema = (schema) =>
  Yup.array().of(schema).nullable();

// Helper function for price comparison
export const isCurrentLessThanOriginal = function (value) {
  console.log(this.options.context.parent || this.parent);

  const { original } = this.options.context.parent || this.parent;
  return original.amount == null || value == null || value < original.amount;
};

// Reusable pricing schema
export const pricingSchema = (condition, customizer = false) =>
  Yup.object({
    original: Yup.object({
      amount: conditionalMeasurementField(condition, customizer),
      currency: Yup.string().default("PKR"),
    }),
    special: Yup.object({
      amount: nullableNumber.test(
        "is-current-greater-than-original",
        "Current price must be less than the original price.",
        isCurrentLessThanOriginal
      ),
      start: nullableString,
      end: nullableString,
      discount: nullableString,
      status: Yup.boolean().default(false),
    }),
    priceFormat: Yup.object({
      decimals: Yup.number().default(2),
      separator: Yup.string().default(","),
    }),
  });

export const packageWeightSchema = (condition, customizer = false) =>
  Yup.object({
    value: conditionalMeasurementField(condition, customizer),
    unit: Yup.string().oneOf(["kg", "g"]).required("Unit is required."),
  });

// Helper for handling measurement fields
export const conditionalMeasurementField = (condition, customizer) =>
  Yup.number().when(`$${condition}`, (variantShipping, schema) => {
    const customizeCondition = customizer
      ? customizer(variantShipping[0])
      : variantShipping[0];

    return transformToNumber(
      customizeCondition
        ? schema
            .required("This field is required.")
            .positive("Must be positive.")
        : schema.nullable()
    );
  });

// Updated dimensionSchema to accept variantShipping argument dynamically
export const dimensionSchema = (condition, customizer = false) =>
  Yup.object({
    length: conditionalMeasurementField(condition, customizer),
    width: conditionalMeasurementField(condition, customizer),
    height: conditionalMeasurementField(condition, customizer),
  }).when(`$${condition}`, (variantShipping, schema) => {
    const customizeCondition = customizer
      ? customizer(variantShipping[0])
      : variantShipping[0];

    if (customizeCondition) {
      return schema.test(
        "dimensions-required",
        "All dimensions must be provided.",
        (value) => value && Object.values(value).every((v) => v)
      );
    }
    return schema;
  });
