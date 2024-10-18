import "./App.css";
import { Suspense } from "react";

// Common Components
import Sidebar from "./components/constant/Sidebar/Sidebar";
import MainLayout from "./layout/mainLayout";
import ToggleTheme from "./components/constant/ToggleTheme/ToggleTheme";
import LoadingSpinner from "./components/Constant/Spinner/Spinner";
import TooltipManager from "./components/constant/ToolTip/TooltipManager";
import { useTooltip } from "./context/Tooltip";

function App() {
  const { tooltipProps } = useTooltip();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Sidebar />
      <MainLayout />
      <ToggleTheme />
      <TooltipManager {...tooltipProps} />
    </Suspense>
  );
}

export default App;
