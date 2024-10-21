import styles from "./index.module.css";
import StatusSidebar from "./components/StatusSidebar";
import ProductForm from "./components/ProductForm";
import ShowcaseHeader from "../../../components/common/ShowcaseV2/ShowcaseHeader";
import classNames from "classnames";

function ShowcaseContent() {
  return (
    <section className={classNames(styles.showcaseContent, "flex")}>
      <ProductForm />
      <StatusSidebar />
    </section>
  );
}

function ProductEntry() {
  return (
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
  );
}

export default ProductEntry;
