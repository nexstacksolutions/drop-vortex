import styles from "../styles/ProductCU.module.css";
import ShowcaseGrid from "../components/common/ShowcaseV2/ShowcaseGrid/ShowcaseGrid";
import StatusSidebar from "../components/pages/ProductCU/StatusSidebar/StatusSidebar";
import ProductForm from "../components/pages/ProductCU/ProductForm/ProductForm";

function ProductCU() {
  return (
    <main className={styles.productCU}>
      <ShowcaseGrid
        customClass={styles.productDetails}
        showcaseHeaderProps={{
          customClass: styles.showcaseHeader,
          showFeatureMsg: false,
          showFilterTabs: false,

          headerWrapperProps: {
            showcaseName: "Add Product",
            showFilterButtons: false,
          },
        }}
        showcaseContentProps={{
          customClass: styles.showcaseContent,
          wrapContent: true,
          StatusSidebar: StatusSidebar,

          showcaseWrapperProps: {
            ShowcaseContainer: ProductForm,
          },
        }}
      />
    </main>
  );
}

export default ProductCU;
