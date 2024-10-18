import { isEqual } from "lodash";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const TooltipContext = createContext();

const TooltipProvider = ({ children }) => {
  const [tooltipProps, setTooltipProps] = useState({});

  const displayTooltip = useCallback(
    ({
      delayShow = 100,
      delayHide = 100,
      clickable = true,
      place = "top",
      ...rest
    }) => {
      setTooltipProps({ delayShow, delayHide, clickable, place, ...rest });
    },
    []
  );

  const handleTooltipTrigger = useCallback(
    (props) => {
      if (!isEqual(props.content, tooltipProps.content)) {
        displayTooltip(props);
      }
    },
    [tooltipProps.content, displayTooltip]
  );

  const contextValue = useMemo(
    () => ({ tooltipProps, handleTooltipTrigger }),
    [tooltipProps, handleTooltipTrigger]
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => useContext(TooltipContext);

export default TooltipProvider;
