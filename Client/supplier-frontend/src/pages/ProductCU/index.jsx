import styles from "./index.module.css";
import StatusSidebar from "./components/StatusSidebar";
import ProductForm from "./components/ProductForm";
import ProductFormProvider from "./contexts/ProductForm";
import ShowcaseHeader from "../../components/common/ShowcaseV2/ShowcaseHeader";
import classNames from "classnames";

function ShowcaseContent() {
  return (
    <section className={classNames(styles.showcaseContent, "flex")}>
      <ProductForm />
      <StatusSidebar />
    </section>
  );
}

function ProductCU() {
  return (
    <ProductFormProvider>
      <main className={styles.showcaseGrid}>
        <ShowcaseHeader
          customClass={styles.showcaseHeader}
          showFeatureMsg={false}
          showFilterTabs={false}
          headerWrapperProps={{
            showcaseName: "Add Product",
            showFilterButtons: false,
          }}
        />
        <ShowcaseContent />
      </main>
    </ProductFormProvider>
  );
}

export default ProductCU;
