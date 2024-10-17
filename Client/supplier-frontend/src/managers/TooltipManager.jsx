import { useEffect } from "react";
import Tooltip from "../components/constant/Tooltip/Tooltip";

const TooltipManager = () => {
  useEffect(() => {
    const showListener = (e) => {
      const tooltip = document.getElementById("singleton-tooltip");
      tooltip &&
        tooltip.showTooltip(
          e.detail.content,
          e.detail.position,
          e.detail.direction
        );
    };

    const hideListener = () => {
      const tooltip = document.getElementById("singleton-tooltip");
      tooltip && tooltip.hideTooltip();
    };

    document.body.addEventListener("show-tooltip", showListener);
    document.body.addEventListener("hide-tooltip", hideListener);

    return () => {
      document.body.removeEventListener("show-tooltip", showListener);
      document.body.removeEventListener("hide-tooltip", hideListener);
    };
  }, []);

  return <Tooltip id="singleton-tooltip" />;
};

export default TooltipManager;
