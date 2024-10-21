// basicInfoSchema.js
import * as Yup from "yup";
import {
  requiredString,
  requiredArrayOfSchema,
  nullableArrayOfSchema,
  fileValidation,
  fileOrUrlValidation,
} from "./validationHelpers";

export const basicInfoSchema = Yup.object({
  productName: requiredString,
  category: requiredString,
  media: Yup.object({
    productImages: requiredArrayOfSchema(
      fileValidation,
      1,
      "The field value is required, Image is missing. Please upload at least 1 image."
    ),
    buyerPromotionImage: nullableArrayOfSchema(fileValidation),
    productVideo: fileOrUrlValidation.nullable(),
  }),
});
