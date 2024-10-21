// descriptionSchema.js
import * as Yup from "yup";
import {
  requiredString,
  nullableString,
  nullableArrayOfSchema,
} from "./validationHelpers";

export const descriptionSchema = Yup.object({
  main: requiredString,
  highlights: requiredString,
  tags: nullableArrayOfSchema(Yup.string()),
  whatsInBox: nullableString,
});
