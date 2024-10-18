import { memo } from "react";
import { Tooltip } from "react-tooltip";

function TooltipManager({ id, content, ...rest }) {
  return (
    <Tooltip anchorSelect={`#${id}`} {...rest}>
      {content}
    </Tooltip>
  );
}

export default memo(TooltipManager);
