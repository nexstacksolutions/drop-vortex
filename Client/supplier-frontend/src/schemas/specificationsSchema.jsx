// specificationsSchema.js
import * as Yup from "yup";
import {
  requiredString,
  requiredNumber,
  nullableArrayOfSchema,
  fileValidation,
} from "./validationHelpers";

export const specificationsSchema = Yup.object({
  brand: Yup.object({
    name: requiredString,
    logo: nullableArrayOfSchema(fileValidation),
  }),
  numberOfPieces: requiredNumber.min(1, "Number of pieces must be at least 1."),
  powerSource: requiredString,
  additionalSpecs: nullableArrayOfSchema(Yup.string()),
});
