import styles from "./FeatureSection.module.css";
import ShowcaseGrid from "../../../Common/ShowCase/ShowcaseGrid/ShowcaseGrid";
import ProductCardV2 from "../../../Common/ShowCase/ShowcaseCard/ProductCardV2/ProductCardV2";
import productList from "../../../../api/featureProductList.json";

function FeatureSection() {
  const showcaseList = [
    {
      name: "Popular Departments",
      list: productList.slice(0, 3),
    },

    {
      name: "New Arrivals",
      list: productList.slice(3, 6),
    },

    {
      name: "Top Ranking",
      list: productList.slice(6, 9),
    },

    {
      name: "Best Sellers",
      list: productList.slice(9, 12),
    },

    {
      name: "Our Featured",
      list: productList.slice(12, 15),
    },

    {
      name: "Trendy Now",
      list: productList.slice(15, 18),
    },
  ];

  return (
    <section className={`${styles.featureSection} flex flex-wrap`}>
      {showcaseList.map((showcase, index) => (
        <ShowcaseGrid
          key={index}
          customClass={styles.showcaseGrid}
          showcaseHeaderProps={{
            customClass: styles.showcaseHeader,
            showcaseName: showcase.name,
          }}
          showcaseContentProps={{
            showcaseList: showcase.list,
            customClass: styles.showcaseContent,

            showcaseWrapperProps: {
              customClass: styles.showcaseWrapper,
              ShowcaseCard: ProductCardV2,

              showcaseCardProps: {
                showProductButtons: false,
                customClass: styles.productCardV2,

                productImagesProps: {
                  customClass: styles.productImages,
                },

                productContentProps: {
                  showVendorNames: false,
                  showProductRatings: false,
                  showDiscountPercentage: false,
                  customClass: styles.productContent,
                },
              },
            },
          }}
        />
      ))}
    </section>
  );
}

export default FeatureSection;
