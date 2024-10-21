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
  pricing: pricingSchema("uiState.variantPricing", (value) => !value),
  stock: conditionalMeasurementField(
    "uiState.variantPricing",
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
          pricing: pricingSchema("uiState.variantPricing", null),
          stock: conditionalMeasurementField("uiState.variantPricing", null),
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
