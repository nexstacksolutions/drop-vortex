import classNames from "classnames";
import styles from "./EduCard.module.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Link } from "react-router-dom";
import { memo } from "react";

function EduCard({ customClass, cardData }) {
  const { cardImage, category, cardTitle, cardViews } = cardData || {};

  return (
    <Link
      className={classNames(styles.eduCard, "flex flex-col", {
        [customClass]: customClass,
      })}
    >
      <figure className={styles.cardImage}>
        <img src={cardImage} alt="" />
      </figure>
      <div className={`${styles.cardContent} flex flex-col`}>
        <span className={styles.category}>{category}</span>
        <h4 className={styles.cardTitle}>{cardTitle}</h4>
        <div
          className={`${styles.cardViewsWrapper} flex justify-start align-center`}
        >
          <MdOutlineRemoveRedEye />
          <span className={styles.cardViews}>{cardViews}</span>
        </div>
      </div>
    </Link>
  );
}

export default memo(EduCard);
