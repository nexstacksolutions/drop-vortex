import styles from "../styles/Product.module.css";
import ProductOverview from "../components/Pages/Product/ProductOverview/ProductOverview";
import ProductDetails from "../components/Pages/Product/ProductDetails/ProductDetails";
import ShowcaseGrid from "../components/Common/ShowCase/ShowcaseGrid/ShowcaseGrid";
import ProductCard from "../components/Common/ShowCase/ShowcaseCard/ProductCard/ProductCard";
import productList from "../api/productList.json";

function Product() {
  const { trending, topSelling } = productList;
  return (
    <main className={styles.productPage}>
      <ProductOverview />
      <ProductDetails />
      <ShowcaseGrid
        showcaseHeaderProps={{ showcaseName: "More Products From This Vendor" }}
        showcaseContentProps={{
          showcaseList: trending,
          showcaseWrapperProps: {
            ShowcaseCard: ProductCard,
          },
        }}
      />
      <ShowcaseGrid
        showcaseHeaderProps={{ showcaseName: "Related products" }}
        showcaseContentProps={{
          showcaseList: topSelling,
          showcaseWrapperProps: {
            ShowcaseCard: ProductCard,
          },
        }}
      />
    </main>
  );
}

export default Product;
