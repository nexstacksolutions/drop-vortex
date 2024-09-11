import styles from "../styles/Home.module.css";
import HeroSection from "../components/Pages/Home/HeroSection/HeroSection";
import FeatureSection from "../components/Pages/Home/FeatureSection/FeatureSection";
import ShowcaseGrid from "../components/Common/ShowCase/ShowcaseGrid/ShowcaseGrid";
import PromotionCard from "../components/Common/ShowCase/ShowcaseCard/PromotionCard/PromotionCard";
import ProductCard from "../components/Common/ShowCase/ShowcaseCard/ProductCard/ProductCard";
import FeatureBannerV2 from "../components/Common/ShowCase/ShowcaseBanner/FeatureBannerV2/FeatureBannerV2";
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
          showcaseWrapperProps: {
            ShowcaseCard: ProductCard,
          },
        }}
      />
      <ShowcaseGrid
        showcaseHeaderProps={{ showcaseName: "New Arrivals" }}
        showcaseContentProps={{
          showcaseList: topSelling,
          showcaseWrapperProps: {
            ShowcaseCard: ProductCard,
            FeatureBannerV2: FeatureBannerV2,
          },
        }}
      />
      <FeatureSection
        showcaseList={featureDeals.slice(3, featureDeals.length)}
      />
      <ShowcaseGrid
        showcaseHeaderProps={{ showcaseName: "Top Rated" }}
        showcaseContentProps={{
          showcaseList: topRated,
          showcaseWrapperProps: {
            ShowcaseCard: ProductCard,
          },
        }}
      />
      <ShowcaseGrid
        showcaseHeaderProps={{ showcaseName: "Selected for You" }}
        showcaseContentProps={{
          showcaseList: trending,
          showcaseWrapperProps: {
            ShowcaseCard: ProductCard,
          },
        }}
      />
      <ShowcaseGrid
        showcaseHeaderProps={{ showcaseName: "Deals & Promotions" }}
        showcaseContentProps={{
          showcaseList: promoOffers,
          showcaseWrapperProps: {
            ShowcaseCard: PromotionCard,
          },
        }}
      />
    </main>
  );
}

export default Home;
