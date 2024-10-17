import { useState, useEffect } from "react";

export const useTooltip = () => {
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!tooltip) {
      setTooltip(document.getElementById("singleton-tooltip"));
    }
  }, [tooltip]);

  return {
    showTooltip: (content, position, direction) => {
      const event = new CustomEvent("show-tooltip", {
        detail: { content, position, direction },
      });
      document.body.dispatchEvent(event);
    },
    hideTooltip: () => {
      const event = new CustomEvent("hide-tooltip");
      document.body.dispatchEvent(event);
    },
  };
};
