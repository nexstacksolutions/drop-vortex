import styles from "./NavBtns.module.css";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import classNames from "classnames";

function NavBtns({ handleNext, handlePrev, customClass }) {
  return (
    <>
      <button
        className={classNames(`${styles.navBtns} ${styles.leftBtn}`, {
          [customClass]: customClass,
        })}
        onClick={handlePrev}
      >
        <FaAngleLeft />
      </button>
      <button
        className={classNames(`${styles.navBtns} ${styles.rightBtn}`, {
          [customClass]: customClass,
        })}
        onClick={handleNext}
      >
        <FaAngleRight />
      </button>
    </>
  );
}

export default NavBtns;
