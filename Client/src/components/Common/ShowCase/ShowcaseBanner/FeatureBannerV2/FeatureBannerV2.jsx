import styles from "./FeatureBannerV2.module.css";
import { Link } from "react-router-dom";
import classNames from "classnames";

function FeatureBannerV2({ cardData, customClass }) {
  return (
    <Link
      className={classNames(
        `${styles.featureBannerV2} flex flex-col justify-start align-start`,
        {
          [customClass]: customClass,
        }
      )}
    >
      <img src="/images/feature/banners/image-1.webp" alt="" />
    </Link>
  );
}

export default FeatureBannerV2;
