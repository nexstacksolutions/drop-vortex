import styles from "./ProductDetails.module.css";
import { useState, memo } from "react";
import VendorCard from "../../../Common/Vendor/VendorCard/VendorCard";
import vendorList from "../../../../api/vendorList.json";
import classNames from "classnames";

//  Description Component
const ProductDesc = memo(() => (
  <div className={`${styles.productDesc} flex flex-col`}>
    <div className={`${styles.descWrapper} flex`}>
      <div className={`${styles.textBlock} flex flex-col`}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt arcu cursus vitae congue mauris. Sagittis id
          consectetur purus ut. Tellus rutrum tellus pelle Vel pretium lectus
          quam id leo in vitae turpis massa.
        </p>

        <ul className={`${styles.featureList} flex flex-col`}>
          <li>
            ✔ Nunc nec porttitor turpis. In eu risus enim. In vitae mollis elit.
          </li>
          <li>✔ Vivamus finibus vel mauris ut vehicula.</li>
          <li>
            ✔ Nullam a magna porttitor, dictum risus nec, faucibus sapien.
          </li>
          <li>
            ✔ Ultrices eros in cursus turpis massa tincidunt ante in nibh mauris
            cursus.
          </li>
          <li>
            ✔ Cras ornare arcu dui vivamus arcu felis bibendum ut tristique.
          </li>
        </ul>
      </div>
      <div className={styles.imageBlock}>
        <img
          src="https://via.placeholder.com/600x320"
          alt="Product Description"
        />
      </div>
    </div>

    <div className={`${styles.featureCards} flex`}>
      <div className={`${styles.card} flex flex-col`}>
        <h5>1. Free Shipping & Return</h5>
        <p>
          We offer free shipping for products on orders above $50 and offer free
          delivery for all orders in the US.
        </p>
      </div>
      <div className={`${styles.card} flex flex-col`}>
        <h5>2. Free and Easy Returns</h5>
        <p>
          We guarantee our products, and you can get back all of your money
          anytime within 30 days.
        </p>
      </div>
      <div className={`${styles.card} flex flex-col`}>
        <h5>3. Special Financing</h5>
        <p>
          Get 20%-50% off items over $50 for a month or over $250 for a year
          with our special credit card.
        </p>
      </div>
    </div>
  </div>
));

ProductDesc.displayName = "ProductDesc";

// Product Specification Component
const ProductSpecs = memo(() => (
  <div className={`${styles.productSpecs} flex flex-wrap`}>
    <div className={styles.specItem}>
      <h5>Brand:</h5>
      <p>Brand Name</p>
    </div>
    <div className={styles.specItem}>
      <h5>Model:</h5>
      <p>Model Number</p>
    </div>
    <div className={styles.specItem}>
      <h5>Color:</h5>
      <p>Product Color</p>
    </div>
    <div className={styles.specItem}>
      <h5>Size:</h5>
      <p>Product Size</p>
    </div>
    <div className={styles.specItem}>
      <h5>Material:</h5>
      <p>Product Material</p>
    </div>
    <div className={styles.specItem}>
      <h5>Weight:</h5>
      <p>Product Weight</p>
    </div>
  </div>
));

ProductSpecs.displayName = "ProductSpecs";

// Vendor Info Component
const VendorInfo = memo(() => (
  <div className={`${styles.vendorInfoContainer} flex flex-col`}>
    <div className={`${styles.vendorOverview} flex`}>
      <div className={styles.vendorImage}>
        <img src="/images/vendors/banner-1.jpg" alt="Vendor Banner" />
      </div>

      <VendorCard
        cardData={vendorList[0]}
        showVendorProducts={false}
        showStoreInfo={true}
        showStoreLink={true}
        customClass={styles.vendorCard}
      />
    </div>

    <div className={styles.vendorDesc}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Venenatis tellus in
        metus vulputate eu scelerisque felis. Vel pretium lectus quam id leo in
        vitae turpis massa. Nunc id cursus metus aliquam. Libero id faucibus
        nisl tincidunt eget. Aliquam id diam maecenas ultricies mi eget mauris.
        Volutpat ac tincidunt vitae semper quis lectus. Vestibulum mattis
        ullamcorper velit sed. A arcu cursus vitae congue mauris. A arcu cursus
        vitae congue mauris. Sagittis id consectetur purus ut. Tellus rutrum
        tellus pellentesque eu tincidunt tortor aliquam nulla. Diam in arcu
        cursus euismod quis. Eget sit amet tellus cras adipiscing enim eu. In
        fermentum et sollicitudin ac orci phasellus. A condimentum vitae sapien
        pellentesque habitant morbi tristique senectus et. In dictum non
        consectetur a erat. Nunc scelerisque viverra mauris in aliquam sem
        fringilla.
      </p>
    </div>
  </div>
));

VendorInfo.displayName = "VendorInfo";

// Section Header Component
function SectionHeader({ handleSectionChange, activeSection }) {
  const isActiveBtn = activeSection.displayName;

  return (
    <div className={`${styles.sectionHeader} flex`}>
      <button
        onClick={() => handleSectionChange(ProductDesc)}
        className={classNames({
          [styles.activeButton]: isActiveBtn === "ProductDesc",
        })}
      >
        Description
      </button>
      <button
        onClick={() => handleSectionChange(ProductSpecs)}
        className={classNames({
          [styles.activeButton]: isActiveBtn === "ProductSpecs",
        })}
      >
        Specification
      </button>
      <button
        onClick={() => handleSectionChange(VendorInfo)}
        className={classNames({
          [styles.activeButton]: isActiveBtn === "VendorInfo",
        })}
      >
        Vendor Info
      </button>
    </div>
  );
}

// Section Content Component
function SectionContent({ activeSection: ActiveSection }) {
  return (
    <div className={styles.sectionContent}>
      <ActiveSection />
    </div>
  );
}

// Main Product Details Component
function ProductDetails({ customClass }) {
  const [activeSection, setActiveSection] = useState(ProductDesc);

  const handleSectionChange = (section) => {
    setActiveSection(() => section);
  };

  return (
    <section
      className={classNames(`${styles.productDetails} flex flex-col`, {
        [customClass]: customClass,
      })}
    >
      <SectionHeader
        handleSectionChange={handleSectionChange}
        activeSection={activeSection}
      />
      <SectionContent activeSection={activeSection} />
    </section>
  );
}

export default ProductDetails;
