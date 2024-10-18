import { memo } from "react";
import { Tooltip } from "react-tooltip";

const TooltipManager = ({ content, customClass, ...rest }) => {
  console.log(rest);

  return (
    <Tooltip anchorSelect="#global-tooltip" className={customClass} {...rest}>
      {content}
    </Tooltip>
  );
};
export default memo(TooltipManager);
