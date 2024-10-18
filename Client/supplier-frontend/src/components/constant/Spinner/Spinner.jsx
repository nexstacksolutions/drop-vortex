import styles from "./Spinner.module.css";
import classNames from "classnames";

function Spinner({ customClass }) {
  return (
    <div
      className={classNames(`${styles.loadingSpinner} flex flex-center`, {
        [customClass]: customClass,
      })}
    >
      <div className={styles.spinner}></div>
    </div>
  );
}

export default Spinner;
