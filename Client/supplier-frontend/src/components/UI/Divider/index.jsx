import styles from "./index.module.css";
import classNames from "classnames";

const Divider = ({ customClass }) => {
  return (
    <div
      className={classNames(styles.divider, {
        [customClass]: customClass,
      })}
    ></div>
  );
};

export default Divider;
