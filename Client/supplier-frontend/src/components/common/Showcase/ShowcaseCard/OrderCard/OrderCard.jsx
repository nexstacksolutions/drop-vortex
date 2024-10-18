import classNames from "classnames";
import styles from "./OrderCard.module.css";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { memo } from "react";

function OrderCard({ customClass, cardData }) {
  const { cardValue = 0, cardTitle } = cardData || {};
  return (
    <div
      className={classNames(styles.orderCard, "flex flex-col flex-center", {
        [customClass]: customClass,
      })}
    >
      <span className={styles.cardValue}>{cardValue}</span>
      <Link className={`${styles.cardTitle} flex-center`}>
        <span>{cardTitle}</span>
        <FaAngleRight />
      </Link>
    </div>
  );
}

export default memo(OrderCard);
