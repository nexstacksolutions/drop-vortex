import "./App.css";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useMedia } from "./context/MediaContext";

// Common Components
import Header from "./components/Constant/Header/Header";
import Footer from "./components/Constant/Footer/Footer";
import LoadingSpinner from "./components/Constant/LoadingSpinner/LoadingSpinner";

function App() {
  const { loading } = useMedia();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Header />
      {loading ? <LoadingSpinner /> : <Outlet />}
      <Footer />
    </Suspense>
  );
}

export default App;
