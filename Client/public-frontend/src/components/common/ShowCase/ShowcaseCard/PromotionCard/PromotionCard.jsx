import styles from "./PromotionCard.module.css";
import classNames from "classnames";

function PromotionCard({ cardData, customClass }) {
  return (
    <div
      className={classNames(`${styles.promotionCard} flex flex-col`, {
        [customClass]: customClass,
      })}
    >
      <div className={styles.cardImage}>
        <img src={cardData.image} alt="" />
      </div>
      <div className={`${styles.cardContent} flex flex-col`}>
        <h3>{cardData.title}</h3>
        <p>{cardData.desc}</p>
      </div>
    </div>
  );
}

export default PromotionCard;
