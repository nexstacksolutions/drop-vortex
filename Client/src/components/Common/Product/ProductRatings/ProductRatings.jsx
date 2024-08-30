import styles from "./ProductRatings.module.css";
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";
import classNames from "classnames";

function ProductRatings({ cardData, customClass }) {
  const { averageRating = 0 } = cardData || {};

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 !== 0;

    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoMdStar key={i} />);
    }

    // Render half star if needed
    if (hasHalfStar) {
      stars.push(<IoMdStarHalf key="half-star" />);
    }

    // Render outline stars to fill up to 5 stars
    const totalStars = stars.length;
    for (let i = totalStars; i < 5; i++) {
      stars.push(<IoMdStarOutline key={i + totalStars} />);
    }

    return stars;
  };

  return (
    <div
      className={classNames(`${styles.productRating} flex flex-center`, {
        [customClass]: customClass,
      })}
    >
      {renderStars()}
    </div>
  );
}

export default ProductRatings;
