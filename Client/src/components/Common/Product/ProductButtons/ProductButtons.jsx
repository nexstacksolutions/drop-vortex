import styles from "./ProductButtons.module.css";
import classNames from "classnames";
import {
  MdOutlineVisibility,
  MdOutlineShoppingCart,
  MdCompareArrows,
} from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";

function ProductButtons({ customClass }) {
  return (
    <div
      className={classNames(
        `${styles.productBtns} flex flex-col justify-start align-center`,
        {
          [customClass]: customClass,
        }
      )}
    >
      <button className={styles.wishlistBtn}>
        <IoMdHeartEmpty />
      </button>
      <button className={styles.compareBtn}>
        <MdOutlineVisibility />
      </button>
      <button className={styles.cartBtn}>
        <MdCompareArrows />
      </button>
      <button className={styles.quickViewBt}>
        <MdOutlineShoppingCart />
      </button>
    </div>
  );
}

export default ProductButtons;
