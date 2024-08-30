import styles from "./FeatureBanner.module.css";
import { Link } from "react-router-dom";
import classNames from "classnames";

function FeatureBanner({ cardData, customClass }) {
  return (
    <Link
      className={classNames(
        `${styles.featureBanner} flex flex-col justify-start align-start`,
        {
          [customClass]: customClass,
        }
      )}
    >
      <img src="/images/feature/banners/image-1.webp" alt="" />
    </Link>
  );
}

export default FeatureBanner;
