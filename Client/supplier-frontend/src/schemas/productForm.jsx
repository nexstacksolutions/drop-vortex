// productFormSchema.js
import * as Yup from "yup";
import { basicInfoSchema } from "./basicInfoSchema";
import { productDetailsSchema } from "./productDetailsSchema";
import { specificationsSchema } from "./specificationsSchema";
import { descriptionSchema } from "./descriptionSchema";
import { shippingSchema } from "./shippingSchema";

const productFormSchema = Yup.object().shape({
  basicInfo: basicInfoSchema,
  productDetails: productDetailsSchema,
  specifications: specificationsSchema,
  description: descriptionSchema,
  shipping: shippingSchema,
});

export default productFormSchema;
