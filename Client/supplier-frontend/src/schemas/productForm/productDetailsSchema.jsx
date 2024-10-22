// productDetailsSchema.js
import * as Yup from "yup";
import {
  requiredString,
  nullableString,
  nullableNumber,
  requiredArrayOfSchema,
  pricingSchema,
  conditionalMeasurementField,
  dimensionSchema,
  nullableArrayOfSchema,
  fileValidation,
  requiredNumber,
  packageWeightSchema,
} from "./validationHelpers";

export const productDetailsSchema = Yup.object({
  pricing: pricingSchema("uiState.variantValues", (value) => !value),
  stock: conditionalMeasurementField(
    "uiState.variantValues",
    (value) => !value
  ),
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
          pricing: pricingSchema("uiState.variantValues", null),
          stock: conditionalMeasurementField("uiState.variantValues", null),
          availability: Yup.boolean().default(true),
          freeItems: nullableString,
          sku: nullableString,
          packageWeight: packageWeightSchema("uiState.variantShipping", null),
          dimensions: dimensionSchema("uiState.variantShipping", null),
        })
      ),
    })
  ),
});
