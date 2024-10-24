import "./App.css";
import { Suspense } from "react";

// Common Components
import Sidebar from "./components/layouts/Sidebar";
import MainLayout from "./layouts/MainLayout";
import ToggleTheme from "./components/UI/ToggleTheme";
import LoadingSpinner from "./components/UI/Spinner";
import { Tooltip } from "react-tooltip";

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Sidebar />
      <MainLayout />
      <ToggleTheme />
      <Tooltip id="global-tooltip" />
    </Suspense>
  );
}

export default App;
