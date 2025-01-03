import classNames from "classnames";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { memo } from "react";

function FeatureCard({ customClass, cardData }) {
  const { Icon, title } = cardData;

  return (
    <Link
      className={classNames(styles.featureCard, "flex flex-col flex-center", {
        [customClass]: customClass,
      })}
    >
      <Icon />
      <span className={styles.cardTitle}>{title}</span>
    </Link>
  );
}

export default memo(FeatureCard);
