import styles from "./index.module.css";
import ShowcaseGrid from ".././../components/common/ShowcaseV2/ShowcaseGrid";
import StatusSidebar from "./components/StatusSidebar";
import ProductForm from "./components/ProductForm";
import ProductFormProvider from "./contexts/ProductForm";

function ProductCU() {
  return (
    <ProductFormProvider>
      <main className={styles.showcaseGrid}>
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
    </ProductFormProvider>
  );
}

export default ProductCU;
