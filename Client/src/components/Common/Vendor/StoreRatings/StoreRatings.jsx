import styles from "./StoreRatings.module.css";
import classNames from "classnames";
import { IoMdStar } from "react-icons/io";

function StoreRatings({ customClass }) {
  return (
    <div
      className={classNames(`${styles.storeRating} flex-inline flex-center`, {
        [customClass]: customClass,
      })}
    >
      <div className={`${styles.ratingWrapper} flex-inline flex-center`}>
        <IoMdStar />
        <IoMdStar />
        <IoMdStar />
        <IoMdStar />
        <IoMdStar />
      </div>
      <div className={`${styles.reviewWrapper} flex-inline  flex-center`}>
        <span className={styles.ratingValue}>4.3</span>
        <span>(18 reviews)</span>
      </div>
    </div>
  );
}

export default StoreRatings;
