import "./App.css";
import { Suspense } from "react";

// Common Components
import Sidebar from "./components/constant/Sidebar/Sidebar";
import MainLayout from "./layout/mainLayout";
import ToggleTheme from "./components/constant/ToggleTheme/ToggleTheme";
import LoadingSpinner from "./components/Constant/LoadingSpinner/LoadingSpinner";

function App() {
  const loading = false; // Simulate loading state
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Sidebar />
      {loading ? <LoadingSpinner /> : <MainLayout />}
      <ToggleTheme />
    </Suspense>
  );
}

export default App;
