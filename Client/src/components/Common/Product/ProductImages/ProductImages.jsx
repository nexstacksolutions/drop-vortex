import classNames from "classnames";
import NavDots from "../../Navigation/NavDots/NavDots";
import styles from "./ProductImages.module.css";

function ProductImages({
  customClass,
  currentImage = 0,
  imageUrls,
  showNavDots,
  navDotsProps,
}) {
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

      {showNavDots && (
        <NavDots
          imageUrls={imageUrls}
          {...navDotsProps}
          activeImageIndex={currentImage}
        />
      )}
    </div>
  );
}

export default ProductImages;
