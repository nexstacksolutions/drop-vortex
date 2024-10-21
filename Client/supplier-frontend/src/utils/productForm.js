import { v4 as uuidv4 } from "uuid";
import { initialFormState } from "../store/productForm/states";

export const createNewVariant = (inputValue, variantImages = []) => ({
  id: uuidv4(),
  name: inputValue,
  variantImages,
  pricing: initialFormState.productDetails.pricing,
  stock: initialFormState.productDetails.stock,
  availability: true,
  freeItems: "",
  sku: "",
  packageWeight: initialFormState.shipping.packageWeight,
  dimensions: initialFormState.shipping.dimensions,
});
