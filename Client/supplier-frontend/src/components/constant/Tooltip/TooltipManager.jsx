import classNames from "classnames";
import { memo } from "react";
import { Tooltip } from "react-tooltip";

function TooltipManager({ id, content, customClass, ...rest }) {
  return (
    <Tooltip
      className={classNames(id, customClass)}
      anchorSelect={`#${id}`}
      {...rest}
    >
      {content}
    </Tooltip>
  );
}

export default memo(TooltipManager);
