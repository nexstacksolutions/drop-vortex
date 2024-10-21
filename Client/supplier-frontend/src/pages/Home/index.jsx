import styles from "./index.module.css";
import FeatureMsg from "../../components/common/FeatureMsg";
import HeroSection from "./components/HeroSection";
import OrdersSection from "./components/OrdersSection";
import VortexAcademy from "./components/VortexAcademy";
import FeatureSection from "./components/FeatureSection";

function Home() {
  const messages = [
    {
      text: "Your shop status is set to holiday mode and all products cannot be purchased by buyers as we have noticed you are inactive in our platform. When you are ready for taking orders, please turn off your holiday mode by going to My Account > Settings > Seller Profile > Holiday Mode and wait 1-2 hours to resume normal sales.",
    },
  ];

  return (
    <>
      <FeatureMsg msgType="warning" messages={messages} />
      <main className={styles.homepage}>
        <HeroSection />
        <OrdersSection />
        <VortexAcademy />
        <FeatureSection />
      </main>
    </>
  );
}

export default Home;
