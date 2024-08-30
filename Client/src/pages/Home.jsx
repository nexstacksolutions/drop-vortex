import styles from "../styles/Home.module.css";
import HeroSection from "../components/Pages/Home/HeroSection/HeroSection";
import FeatureSection from "../components/Pages/Home/FeatureSection/FeatureSection";
import ShowcaseGrid from "../components/Common/ShowCase/ShowcaseGrid/ShowcaseGrid";
import PromotionCard from "../components/Common/ShowCase/ShowcaseCard/PromotionCard/PromotionCard";
import ProductCard from "../components/Common/ShowCase/ShowcaseCard/ProductCard/ProductCard";
import FeatureBanner from "../components/Common/ShowCase/ShowcaseBanner/FeatureBanner/FeatureBanner";
import productList from "../api/productList.json";
import featureDeals from "../api/featureDeals.json";
import promoOffers from "../api/promoOffers.json";

function Home() {
  const { trending, topSelling, topRated } = productList;

  return (
    <main className={styles.homePage}>
      <HeroSection />
      <FeatureSection showcaseList={featureDeals.slice(0, 3)} />
      <ShowcaseGrid
        showcaseHeaderProps={{ showcaseName: "Trending Products" }}
        showcaseContentProps={{
          showcaseList: trending,
          ShowcaseCard: ProductCard,
        }}
      />
      <ShowcaseGrid
        showcaseList={topRated}
        showcaseName={"High Profit"}
        ShowcaseCard={ProductCard}
        showcaseHeaderProps={{ showcaseName: "New Arrivals" }}
        showcaseContentProps={{
          showcaseList: topSelling,
          ShowcaseCard: ProductCard,
          FeatureBanner: FeatureBanner,
        }}
      />
      <FeatureSection
        showcaseList={featureDeals.slice(3, featureDeals.length)}
      />
      <ShowcaseGrid
        showcaseHeaderProps={{ showcaseName: "Top Rated" }}
        showcaseContentProps={{
          showcaseList: topRated,
          ShowcaseCard: ProductCard,
        }}
      />
      <ShowcaseGrid
        showcaseHeaderProps={{ showcaseName: "Selected for You" }}
        showcaseContentProps={{
          showcaseList: trending,
          ShowcaseCard: ProductCard,
        }}
      />
      <ShowcaseGrid
        showcaseHeaderProps={{ showcaseName: "Deals & Promotions" }}
        showcaseContentProps={{
          showcaseList: promoOffers,
          ShowcaseCard: PromotionCard,
        }}
      />
    </main>
  );
}

export default Home;
