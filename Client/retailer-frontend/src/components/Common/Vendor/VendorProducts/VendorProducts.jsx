import styles from "./VendorProducts.module.css";
import { Link } from "react-router-dom";

function VendorProducts({ products }) {
  return (
    <div className={`${styles.vendorProducts} flex`}>
      {products.slice(0, 3).map((product, index) => (
        <Link
          key={index}
          className={`${styles.productImage} flex flex-center`}
          to={`/product/${product.id}`}
        >
          <img src={product?.imageUrls} alt={product.name || "Product image"} />
        </Link>
      ))}
    </div>
  );
}

export default VendorProducts;
