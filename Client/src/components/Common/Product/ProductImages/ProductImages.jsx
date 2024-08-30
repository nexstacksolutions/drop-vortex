import classNames from "classnames";
import NavDots from "../../Navigation/NavDots/NavDots";
import styles from "./ProductImages.module.css";

function ProductImages({
  cardData,
  currentImage = 0,
  customClass,
  navDotsProps,
}) {
  const { imageUrls } = cardData;

  if (!imageUrls || imageUrls.length === 0) {
    return null; // or render a placeholder image
  }

  return (
    <div
      className={classNames(`${styles.productImages} flex flex-center`, {
        [customClass]: customClass,
      })}
    >
      <img
        className={styles.image}
        src={imageUrls[currentImage]}
        alt={`Product image ${currentImage + 1}`}
      />

      {navDotsProps?.showNavDots && (
        <NavDots
          cardData={cardData}
          activeImageIndex={currentImage}
          customClass={navDotsProps.customClass}
        />
      )}
    </div>
  );
}

export default ProductImages;
