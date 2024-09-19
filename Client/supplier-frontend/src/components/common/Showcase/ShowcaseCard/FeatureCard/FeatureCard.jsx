import classNames from "classnames";
import styles from "./FeatureCard.module.css";
import { Link } from "react-router-dom";

function FeatureCard({ customClass, cardData }) {
  const { icon, title } = cardData;

  return (
    <Link
      className={classNames(styles.featureCard, "flex flex-col flex-center", {
        [customClass]: customClass,
      })}
    >
      <img src={icon} alt="" />
      <span className={styles.cardTitle}>{title}</span>
    </Link>
  );
}

export default FeatureCard;
