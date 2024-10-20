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

  const handleTooltipTrigger = useCallback(
    (props) => {
      if (!isEqual(props.content, tooltipProps.content)) {
        setTooltipProps(props);
      }
    },
    [tooltipProps.content]
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
