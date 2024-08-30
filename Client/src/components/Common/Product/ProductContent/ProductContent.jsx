import styles from "./ProductContent.module.css";
import ProductRatings from "../ProductRatings/ProductRatings";
import { DiscountIcon } from "../../FeatureIcons/FeatureIcons";
import classNames from "classnames";

function ProductContent(props) {
  const { cardData, customClass } = props;
  const { currentPrice, originalPrice, vendorName, productName } = cardData;

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <>
      <div
        className={classNames(
          `${styles.productContent} flex flex-col justify-start align-start`,
          {
            [customClass]: customClass,
          }
        )}
      >
        <div
          className={`${styles.productDetails} flex flex-col justify-start align-start`}
        >
          <span className={styles.vendorName}>{vendorName}</span>
          <h4 className={styles.productName}>{productName}</h4>
        </div>

        <ProductRatings cardData={cardData} />

        <div
          className={`${styles.productPrice} flex justify-start align-center`}
        >
          <span className={styles.currentPrice}>{`$${currentPrice}`}</span>
          {originalPrice && (
            <span className={styles.originalPrice}>{`$${originalPrice}`}</span>
          )}
        </div>
      </div>

      {discountPercentage > 0 && <DiscountIcon discount={discountPercentage} />}
    </>
  );
}

export default ProductContent;
