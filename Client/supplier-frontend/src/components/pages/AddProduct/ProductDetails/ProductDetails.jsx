import styles from "./ProductDetails.module.css";
import ShowcaseGrid from "../../../common/ShowcaseV2/ShowcaseGrid/ShowcaseGrid";
import StatusSidebar from "../StatusSidebar/StatusSidebar";
import ProductForm from "../ProductForm/ProductForm";

function ProductDetails() {
  return (
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
  );
}

export default ProductDetails;
