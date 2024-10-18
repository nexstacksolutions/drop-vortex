import { isEqual } from "lodash";
import {
  createContext,
  useMemo,
  useContext,
  useState,
  useCallback,
} from "react";

const TooltipContext = createContext();

const TooltipProvider = ({ children }) => {
  const [toolTipProps, setToolTipProps] = useState({});
  const [hasDisplayedTooltip, setHasDisplayedTooltip] = useState(false);

  const displayTooltip = useCallback(
    ({ content, delayShow = 100, delayHide = 100, ...rest }) => {
      if (!isEqual(content, toolTipProps.content)) {
        setToolTipProps({ content, delayShow, delayHide, ...rest });
      }
    },
    [toolTipProps]
  );

  const handleTooltipTrigger = useCallback(
    (props) => {
      if (!hasDisplayedTooltip) {
        displayTooltip(props);
        setHasDisplayedTooltip(true);
      }
    },
    [displayTooltip, hasDisplayedTooltip]
  );

  const handleMouseLeave = () => {
    setHasDisplayedTooltip(false);
  };

  const values = useMemo(
    () => ({
      toolTipProps,
      handleTooltipTrigger,
      handleMouseLeave,
    }),
    [toolTipProps, handleTooltipTrigger]
  );

  return (
    <TooltipContext.Provider value={values}>{children}</TooltipContext.Provider>
  );
};

export const useTooltip = () => useContext(TooltipContext);

export default TooltipProvider;
