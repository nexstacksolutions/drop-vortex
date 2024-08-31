import styles from "./ProductCardV2.module.css";
import { Link } from "react-router-dom";
import { useCallback, useState } from "react";
import ProductButtons from "../../../Product/ProductButtons/ProductButtons";
import ProductImages from "../../../Product/ProductImages/ProductImages";
import ProductContent from "../../../Product/ProductContent/ProductContent";
import classNames from "classnames";

function ProductCardV2({ cardData, showcaseCardProps }) {
  const {
    customClass,
    productImagesProps,
    productContentProps,
    showProductButtons,
  } = showcaseCardProps || {};
  const { imageUrls } = cardData;
  const [currentImage, setCurrentImage] = useState(0);

  const handleMouseMove = useCallback(
    (e) => {
      const card = e.currentTarget;
      const cardWidth = card.offsetWidth;
      const cardLeft = card.getBoundingClientRect().left;
      const mouseX = e.clientX - cardLeft;

      // Calculate imageIndex, ensuring it's within the valid range
      const imageIndex = Math.min(
        Math.max(Math.floor((mouseX / cardWidth) * imageUrls.length), 0),
        imageUrls.length - 1
      );

      setCurrentImage(imageIndex);
    },
    [imageUrls.length]
  );

  const handleMouseLeave = useCallback(() => {
    setCurrentImage(0);
  }, []);

  return (
    <Link
      className={classNames(
        `${styles.productCardV2} flex flex-col justify-start align-start`,
        {
          [customClass]: customClass,
        }
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ProductImages
        currentImage={currentImage}
        cardData={cardData}
        navDotsProps={{ showNavDots: true, customClass: styles.navDots }}
        productImagesProps={productImagesProps}
      />
      {showProductButtons && (
        <ProductButtons
          cardData={cardData}
          customClass={styles.productButtons}
        />
      )}
      <ProductContent
        cardData={cardData}
        customClass={styles.productContent}
        productContentProps={productContentProps}
      />
    </Link>
  );
}

export default ProductCardV2;
