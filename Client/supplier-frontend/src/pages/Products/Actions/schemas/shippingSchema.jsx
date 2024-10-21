// shippingSchema.js
import * as Yup from "yup";
import {
  dimensionSchema,
  nullableString,
  packageWeightSchema,
} from "./validationHelpers";

export const shippingSchema = Yup.object({
  packageWeight: packageWeightSchema(
    "uiState.variantShipping",
    (value) => !value
  ),
  dimensions: dimensionSchema("uiState.variantShipping", (value) => !value),
  dangerousGoods: nullableString,
  warranty: Yup.object({
    type: nullableString,
    period: nullableString,
    policy: nullableString,
  }),
});
