import styles from "./FeatureBanner.module.css";
import { Link } from "react-router-dom";
import classNames from "classnames";

function FeatureBanner({ cardData, customClass }) {
  return (
    <Link
      className={classNames(`${styles.featureBanner} flex flex-center`, {
        [customClass]: customClass,
      })}
    >
      <div className={styles.cardImage}>
        <img src={cardData.image} alt="" />
      </div>
      <div className={`${styles.cardContent} flex flex-col`}>
        <div className={`${styles.cardDetails} flex flex-col`}>
          <span className={styles.subTitle}>{cardData.subTitle}</span>
          <span className={styles.title}>{cardData.title}</span>
        </div>
        <button>{cardData.link}</button>
      </div>
    </Link>
  );
}

export default FeatureBanner;
