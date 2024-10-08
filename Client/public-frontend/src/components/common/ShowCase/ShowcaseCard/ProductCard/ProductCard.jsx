import styles from "./ProductCard.module.css";
import { Link } from "react-router-dom";
import { useCallback, useState } from "react";
import ProductContent from "../../../Product/ProductContent/ProductContent";
import ProductButtons from "../../../Product/ProductButtons/ProductButtons";
import ProductImages from "../../../Product/ProductImages/ProductImages";
import classNames from "classnames";

function ProductCard({
  cardData,
  customClass,
  productImagesProps,
  productContentProps,
  showProductButtons = true,
}) {
  const { imageUrls } = cardData;
  const [currentImage, setCurrentImage] = useState(0);

  const handleImageChange = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % imageUrls?.length);
  }, [imageUrls?.length]);

  const handleMouseLeave = useCallback(() => {
    setCurrentImage(0);
  }, []);

  return (
    <Link
      className={classNames(
        `${styles.productCard} flex flex-col justify-start align-start`,
        {
          [customClass]: customClass,
        }
      )}
      onMouseEnter={handleImageChange}
      onMouseLeave={handleMouseLeave}
    >
      <ProductImages
        currentImage={currentImage}
        {...cardData}
        {...productImagesProps}
      />
      {showProductButtons && <ProductButtons cardData={cardData} />}
      <ProductContent cardData={cardData} {...productContentProps} />
    </Link>
  );
}

export default ProductCard;
