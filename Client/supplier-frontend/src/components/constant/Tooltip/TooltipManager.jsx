import { memo } from "react";
import classNames from "classnames";
import { Tooltip } from "react-tooltip";
import styles from "./TooltipManager.module.css";

const TooltipManager = ({ content, customClass, ...rest }) => {
  return (
    <Tooltip
      anchorSelect="#global-tooltip"
      clickable
      className={classNames(styles.globalTooltip, customClass)}
      {...rest}
    >
      {content}
    </Tooltip>
  );
};
export default memo(TooltipManager);
