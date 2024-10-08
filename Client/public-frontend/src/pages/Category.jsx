import styles from "../styles/Category.module.css";
import CategoryBanner from "../components/Pages/Category/CategoryBanner/CategoryBanner";
import ProductCard from "../components/Common/ShowCase/ShowcaseCard/ProductCard/ProductCard";
import ProductCardV2 from "../components/Common/ShowCase/ShowcaseCard/ProductCardV2/ProductCardV2";
import VendorCard from "../components/Common/Vendor/VendorCard/VendorCard";
import FeatureSection from "../components/Pages/Category/FeatureSection/FeatureSection";
import ShowcaseGrid from "../components/Common/ShowCase/ShowcaseGrid/ShowcaseGrid";
import productData from "../api/ProductDetails.json";
import productList from "../api/productList.json";
import vendorList from "../api/vendorList.json";

function Category() {
  return (
    <main className={styles.categoryPage}>
      <CategoryBanner />

      <ShowcaseGrid
        customClass={`${styles.vendorSection} ${styles.showcaseGrid}`}
        showcaseHeaderProps={{
          customClass: styles.showcaseHeader,
          showcaseName: "Top Weekly Vendors",
        }}
        showcaseContentProps={{
          customClass: styles.showcaseContent,
          showcaseList: vendorList,

          showcaseWrapperProps: {
            customClass: styles.showcaseWrapper,
            ShowcaseCard: VendorCard,
          },
        }}
      />

      <FeatureSection />

      <ShowcaseGrid
        customClass={styles.showcaseGrid}
        showcaseHeaderProps={{
          showcaseName: "Deals of the day",
          showDealTimer: true,
          dealTimerProps: {
            endTime: "2024-09-07T23:59",
          },
        }}
        showcaseContentProps={{
          showcaseList: productList.trending,

          showcaseWrapperProps: {
            ShowcaseCard: ProductCard,
          },
        }}
      />

      <ShowcaseGrid
        customClass={styles.showcaseGrid}
        showcaseHeaderProps={{
          showcaseName: "Hot Picks",
          showFilterTabs: true,
        }}
        showcaseContentProps={{
          customClass: styles.showcaseContent,
          showcaseList: [
            productData,
            ...productList.trending,
            ...productList.topSelling,
          ],
          FeatureCard: ProductCardV2,
          featureCardProps: {
            customClass: styles.featureCard,
            productImagesProps: {
              customClass: styles.productImages,
            },
            productContentProps: {
              customClass: styles.productContent,
            },
          },
          wrapContent: true,

          showcaseWrapperProps: {
            customClass: styles.showcaseWrapper,
            ShowcaseCard: ProductCardV2,
            showcaseCardProps: {
              customClass: styles.productCardV2,

              productImagesProps: {
                customClass: styles.productImages,
              },
              productContentProps: {
                customClass: styles.productContent,
              },
            },
          },
        }}
      />

      <ShowcaseGrid
        customClass={styles.showcaseGrid}
        showcaseHeaderProps={{
          showcaseName: "All in Home, Garden & Tools",
        }}
        showcaseContentProps={{
          showcaseList: productList.trending,
          showcaseWrapperProps: { ShowcaseCard: ProductCard },
        }}
      />
    </main>
  );
}

export default Category;
