import styles from "../styles/AddProduct.module.css";
import ProductDetails from "../components/pages/AddProduct/ProductDetails/ProductDetails";

function AddProduct() {
  return (
    <main className={styles.addProduct}>
      <ProductDetails />
    </main>
  );
}

export default AddProduct;
