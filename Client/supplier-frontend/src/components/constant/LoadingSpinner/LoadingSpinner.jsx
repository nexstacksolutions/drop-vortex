import styles from "./LoadingSpinner.module.css";
import classNames from "classnames";

function LoadingSpinner({ customClass }) {
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

export default LoadingSpinner;
