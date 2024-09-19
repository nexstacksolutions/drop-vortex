import styles from "./MainLayout.module.css";
import { Outlet } from "react-router-dom";

// Common Components
import Footer from "../components/Constant/Footer/Footer";
import LoadingSpinner from "../components/Constant/LoadingSpinner/LoadingSpinner";

function MainLayout() {
  const loading = false; // will Replace with your actual loading state

  return (
    <div className={`${styles.mainLayout} flex flex-col`}>
      {loading ? <LoadingSpinner /> : <Outlet />}
      <Footer />
    </div>
  );
}

export default MainLayout;
