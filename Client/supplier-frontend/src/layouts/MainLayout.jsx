import styles from "./MainLayout.module.css";
import { Outlet } from "react-router-dom";

// Common Components
import Footer from "../components/layouts/Footer";

function MainLayout() {
  return (
    <div className={`${styles.mainLayout} flex flex-col custom-scrollbar`}>
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout;
