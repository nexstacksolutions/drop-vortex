import styles from "./FeatureMsg.module.css";
import classNames from "classnames";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaRegCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { memo } from "react";

function FeatureMsg({ customClass, messages, msgType = "warning" }) {
  return (
    <header
      className={classNames(styles.featureMsg, "flex", {
        [customClass]: customClass,
      })}
    >
      {msgType === "warning" ? <RiErrorWarningLine /> : <FaRegCircleCheck />}
      <div className={styles.msgWrapper}>
        {messages?.map(({ text, linkText, path }, index) => (
          <div key={index} className={`${styles.message} flex`}>
            <p>{text}</p>
            {linkText && path && <Link to={path}>{linkText}</Link>}
          </div>
        ))}
      </div>
    </header>
  );
}

export default memo(FeatureMsg);
