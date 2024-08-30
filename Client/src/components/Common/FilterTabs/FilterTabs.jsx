import styles from "./FilterTabs.module.css";
import classNames from "classnames";

function FilterTabs({ customClass }) {
  return (
    <div
      className={classNames(
        `${styles.filterTabs} flex justify-end align-center`,
        {
          [customClass]: customClass,
        }
      )}
    >
      <button className={`${styles.filterBtn} ${styles.active}`}>
        New Arrivals
      </button>
      <button className={styles.filterBtn}>Best Seller</button>
      <button className={styles.filterBtn}>Most Popular</button>
      <button className={styles.filterBtn}>Feature</button>
    </div>
  );
}

export default FilterTabs;
