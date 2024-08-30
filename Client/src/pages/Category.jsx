import styles from "../styles/Category.module.css";
import CategoryBanner from "../components/Pages/Category/CategoryBanner/CategoryBanner";
import ProductCard from "../components/Common/ShowCase/ShowcaseCard/ProductCard/ProductCard";
import ProductCardV2 from "../components/Common/ShowCase/ShowcaseCard/ProductCardV2/ProductCardV2";
import ShowcaseGrid from "../components/Common/ShowCase/ShowcaseGrid/ShowcaseGrid";
import productData from "../api/ProductDetails.json";
import productList from "../api/productList.json";

function Category() {
  return (
    <main className={styles.categoryPage}>
      <CategoryBanner />

      <ShowcaseGrid
        customClass={styles.showcaseGrid}
        showcaseHeaderProps={{
          showcaseName: "Deals of the day",
          dealTimerProps: {
            showDealTimer: true,
            endTime: "2024-08-31T23:59",
          },
        }}
        showcaseContentProps={{
          showcaseList: productList.trending,
          ShowcaseCard: ProductCard,
        }}
      />

      <ShowcaseGrid
        customClass={styles.showcaseGrid}
        showcaseHeaderProps={{
          showcaseName: "Hot Picks",
          showFilterTabs: true,
        }}
        showcaseContentProps={{
          showcaseList: [
            productData,
            ...productList.trending,
            ...productList.topSelling,
          ],
          ShowcaseCard: ProductCard,
          FeatureCard: ProductCardV2,
          wrapContent: true,
        }}
      />

      <ShowcaseGrid
        customClass={styles.showcaseGrid}
        showcaseHeaderProps={{
          showcaseName: "All in Home, Garden & Tools",
        }}
        showcaseContentProps={{
          showcaseList: productList.trending,
          ShowcaseCard: ProductCard,
        }}
      />
    </main>
  );
}

export default Category;
