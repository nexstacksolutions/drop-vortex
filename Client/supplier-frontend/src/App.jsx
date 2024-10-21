import "./App.css";
import { Suspense } from "react";

// Common Components
import Sidebar from "./components/layouts/Sidebar";
import MainLayout from "./layouts/MainLayout";
import ToggleTheme from "./components/UI/ToggleTheme";
import LoadingSpinner from "./components/UI/Spinner";
import TooltipManager from "./components/UI/Tooltip";
import { useTooltip } from "./contexts/Tooltip";

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
