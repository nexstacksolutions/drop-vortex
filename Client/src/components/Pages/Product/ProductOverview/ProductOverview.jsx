import styles from "./ProductOverview.module.css";
import { Link } from "react-router-dom";
import { useCallback, useRef, useState, memo } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { IoMdHeartEmpty, IoIosGitCompare } from "react-icons/io";
import classNames from "classnames";
import ProductData from "../../../../api/ProductDetails.json";
import NavBtns from "../../../Common/Navigation/NavBtns/NavBtns";
import Divider from "../../../Constant/Divider/Divider";
import SocialIcons from "../../../Common/SocialIcons/SocialIcons";
import ProductRating from "../../../Common/Product/ProductRatings/ProductRatings";

// Breadcrumbs Component
const BreadCrumbs = memo(() => {
  const breadcrumbs = [
    "Dropshipping Products",
    "Clothing, Shoes & Jewelry",
    "Women",
    "Women's Clothing",
  ];

  return (
    <nav className={`${styles.breadcrumbs} flex`}>
      {breadcrumbs.map((breadcrumb, index) => (
        <Link
          key={index}
          className={`${styles.breadcrumbItem} flex flex-center`}
        >
          <span>{breadcrumb}</span>
          {index < breadcrumbs.length - 1 && <FaAngleRight />}
        </Link>
      ))}
    </nav>
  );
});

BreadCrumbs.displayName = "BreadCrumbs";

// Thumbnail Component
const Thumbnail = memo(({ image, index, onClick }) => (
  <img
    src={image}
    alt={`Thumbnail ${index + 1}`}
    onClick={onClick}
    className={styles.thumbnail}
  />
));

Thumbnail.displayName = "Thumbnail";

// Product Image Gallery Component
const ProductImageGallery = () => {
  const { imageUrls } = ProductData;
  const [currentImage, setCurrentImage] = useState(0);
  const thumbListRef = useRef(null);

  const handleImageChange = useCallback((index) => {
    setCurrentImage(index);
  }, []);

  const handleImageNext = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % imageUrls.length);
  }, [imageUrls.length]);

  const handleImagePrev = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  }, [imageUrls.length]);

  const handleScroll = useCallback((direction) => {
    const thumbList = thumbListRef.current;
    const thumbWidth = thumbList.children[0].clientWidth;

    direction === "next"
      ? (thumbList.scrollLeft += thumbWidth)
      : (thumbList.scrollLeft -= thumbWidth);
  }, []);

  return (
    <div className={`${styles.productImageGallery} flex flex-col`}>
      <div className={`${styles.mainImage} flex`}>
        <img
          src={imageUrls[currentImage]}
          alt={`Product Image ${currentImage + 1}`}
        />
        <NavBtns handleNext={handleImageNext} handlePrev={handleImagePrev} />
      </div>
      <div className={styles.thumbList}>
        <div className={`${styles.thumbWrapper} flex`} ref={thumbListRef}>
          {imageUrls.map((image, index) => (
            <Thumbnail
              key={index}
              image={image}
              index={index}
              onClick={() => handleImageChange(index)}
            />
          ))}
        </div>
        <NavBtns
          handleNext={() => handleScroll("next")}
          handlePrev={() => handleScroll("prev")}
          customClass={styles.thumbListNavBtns}
        />
      </div>
    </div>
  );
};

// ProductSummary Component
const ProductSummary = () => {
  const [count, setCount] = useState(1);

  const {
    productName,
    brand,
    currentPrice,
    originalPrice,
    averageRating,
    reviewCount,
    featureList,
    variationAttributes,
  } = ProductData;

  const handleCount = (sign) => {
    if (sign === "+") {
      count < 100 ? setCount((prev) => prev + 1) : count;
    } else {
      count > 1 ? setCount((prev) => prev - 1) : count;
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);

    if (value >= 1 && value <= 100) {
      setCount(value);
    } else {
      alert("Please enter a valid quantity between 1 and 100.");
    }
  };

  return (
    <div className={`${styles.productSummary} flex flex-col`}>
      <div className={`${styles.summaryInfo} flex flex-col`}>
        <h1 className={styles.productTitle}>{productName}</h1>
        <div
          className={`${styles.brandWrapper} flex justify-start align-center`}
        >
          <div className={`${styles.imgWrapper} flex flex-center`}>
            <img
              src={brand.logo}
              alt="Brand Logo"
              className={styles.brandLogo}
            />
          </div>
          <div className={`${styles.categoryWrapper} flex flex-col`}>
            <div className={`${styles.categoryBreadcrumbs} flex`}>
              <span>Categories:</span>
              <div className={`${styles.breadcrumbsWrapper} flex`}>
                <span>Furniture,</span>
                <span>Home & Garden</span>
              </div>
            </div>
            <div className={`${styles.skuWrapper} flex`}>
              <span>SKU:</span>
              <span>{ProductData.sku}</span>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className={`${styles.summaryMeta} flex flex-col`}>
        <div className={`${styles.productPrice} flex`}>
          <span className={styles.currentPrice}>${currentPrice}</span>
          <span className={styles.originalPrice}>${originalPrice}</span>
        </div>
        <div className={`${styles.productRating} flex`}>
          <ProductRating />
          <span className={styles.ratingValue}>{averageRating}</span>
          <span className={styles.reviewCount}>({reviewCount})</span>
        </div>
        <div className={`${styles.productFeatures} flex flex-col`}>
          {featureList.map((feature, index) => (
            <div key={index} className={`${styles.featureItem} flex`}>
              <span>✔</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div className={`${styles.variationOptions} flex flex-col`}>
        {variationAttributes.map((variation, index) => (
          <div
            key={index}
            className={`${styles.variationWrapper} flex align-center`}
          >
            <span className={styles.variationType}>{variation.type}:</span>

            <div className={`${styles.variationValues} flex align-center`}>
              {variation.values.map((value, index) => (
                <span
                  key={index}
                  className={classNames(
                    styles[`${variation.type.toLocaleLowerCase()}Option`],
                    {
                      [styles.active]: index === variation.values.length - 1,
                    }
                  )}
                  style={{
                    backgroundColor: value.toLocaleLowerCase(),
                  }}
                >
                  {variation.type !== "Color" ? value : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Divider />

      <div className={`${styles.productSpec} flex flex-col`}>
        <div
          className={`${styles.productActions} flex flex-wrap justify-between`}
        >
          <div className={`${styles.quantityWrapper} flex align-center`}>
            <span>Quantity:</span>
            <div className={`${styles.quantityControls} flex`}>
              <input
                type="number"
                value={count}
                onChange={handleInputChange}
                className={styles.quantityInput}
              />
              <button
                onClick={() => handleCount("-")}
                className={styles.decrementBtn}
              >
                &#8722;
              </button>
              <button
                onClick={() => handleCount("+")}
                className={styles.incrementBtn}
              >
                &#43;
              </button>
            </div>
          </div>
          <button className={styles.addToCartBtn}>Add to Cart</button>
          <div className={`${styles.actionBtns} flex justify-start`}>
            <button className={styles.addToInventory}>
              Add to Inventory Lists
            </button>
            <button className={styles.listToStore}>List to Store</button>
            <button className={styles.downLoadBtn}>Download</button>
          </div>
        </div>

        <div className={`${styles.socialActions} flex align-center`}>
          <SocialIcons />
          <span className={styles.verticalDivider}></span>

          <div className={`${styles.actionButtons} flex`}>
            <button className={styles.compareButton}>
              <IoIosGitCompare />
            </button>
            <button className={styles.wishlistButton}>
              <IoMdHeartEmpty />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Product Overview Component
const ProductOverview = ({ customClass }) => (
  <>
    <BreadCrumbs />
    <section
      className={classNames(
        `${styles.productOverview} flex justify-between align-start`,
        {
          [customClass]: customClass,
        }
      )}
    >
      <ProductImageGallery />
      <ProductSummary />
    </section>
  </>
);

export default ProductOverview;
