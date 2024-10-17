import styles from "./Tooltip.module.css";
import ReactDOM from "react-dom";
import { useState, useRef, memo } from "react";

const Tooltip = () => {
  const [tooltipData, setTooltipData] = useState({
    isVisible: false,
    content: "",
    position: { top: 0, left: 0 },
    direction: "top",
  });
  const tooltipRef = useRef(null);

  const showTooltip = ({ content, position, direction = "top" }) => {
    setTooltipData({ isVisible: true, content, position, direction });
  };

  const hideTooltip = () => {
    setTooltipData({ ...tooltipData, isVisible: false });
  };

  return ReactDOM.createPortal(
    tooltipData.isVisible && (
      <div
        ref={tooltipRef}
        className={styles.tooltipWrapper}
        style={{
          top: `${tooltipData.position.top}px`,
          left: `${tooltipData.position.left}px`,
        }}
      >
        <div
          className={`${styles.tooltipArrow} ${styles[tooltipData.direction]}`}
        />

        <div className={styles.tooltipContent}>{tooltipData.content}</div>
      </div>
    ),
    document.body
  );
};

export default memo(Tooltip);
