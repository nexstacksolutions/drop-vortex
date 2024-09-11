import "./App.css";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

// Common Components
import Header from "./components/Constant/Header/Header";
import Footer from "./components/Constant/Footer/Footer";
import LoadingSpinner from "./components/Constant/LoadingSpinner/LoadingSpinner";
import ToggleTheme from "./components/constant/ToggleTheme/ToggleTheme";

function App() {
  const loading = false;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Header />
      {loading ? <LoadingSpinner /> : <Outlet />}
      <ToggleTheme />
      <Footer />
    </Suspense>
  );
}

export default App;
