import classNames from "classnames";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { memo } from "react";

function OptBtn({ customClass, path, icon, btnText }) {
  return (
    <Link
      to={path}
      className={classNames(styles.optBtn, "align-center", {
        [customClass]: customClass,
      })}
    >
      {icon}
      <span>{btnText}</span>
    </Link>
  );
}

function ShowcaseHeader({
  customClass,
  showcaseName,
  optBtnProps,
  showOptBtn = false,
}) {
  return (
    <div
      className={classNames(
        styles.showcaseHeader,
        "flex justify-between align-center",
        {
          [customClass]: customClass,
        }
      )}
    >
      <h2>{showcaseName}</h2>

      {showOptBtn && <OptBtn {...optBtnProps} />}

      <Link className="flex-center">
        <span>More</span>
        <FaArrowRightLong />
      </Link>
    </div>
  );
}

export default memo(ShowcaseHeader);
