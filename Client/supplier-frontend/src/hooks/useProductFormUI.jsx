import { useContext } from "react";
import { ProductFormUIContext } from "../context/ProductForm";

const useProductFormUI = () => useContext(ProductFormUIContext);

export default useProductFormUI;
