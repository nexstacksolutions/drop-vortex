import styles from "./FeatureIcons.module.css";
import classNames from "classnames";

function FeatureDot({ customClass }) {
  return (
    <span
      className={classNames(`${styles.featureDot} new-dot`, {
        [customClass]: customClass,
      })}
    />
  );
}

function DiscountIcon({ discount, customClass }) {
  return (
    <span
      className={classNames(`${styles.discountIcon} flex flex-center`, {
        [customClass]: customClass,
      })}
    >
      {`-${discount}%`}
    </span>
  );
}

function FeatureIcon({ label = "New", popup, customClass }) {
  return (
    <span
      className={classNames(`${styles.featureIcon} flex-inline flex-center`, {
        [styles.popup]: popup,
        [customClass]: customClass,
      })}
    >
      {label}
    </span>
  );
}

export { FeatureDot, FeatureIcon, DiscountIcon };
