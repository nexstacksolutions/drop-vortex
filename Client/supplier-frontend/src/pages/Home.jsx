import styles from "../styles/pages/Home.module.css";
import FeatureMsg from "../components/common/FeatureMsg/FeatureMsg";
import HeroSection from "../components/pages/Home/HeroSection/HeroSection";
import OrdersSection from "../components/pages/Home/OrdersSection/OrdersSection";
import VortexAcademy from "../components/pages/Home/VortexAcademy/VortexAcademy";
import FeatureSection from "../components/pages/Home/FeatureSection/FeatureSection";

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
