import styles from "./CategoryBanner.module.css";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";
import { useCallback, useRef } from "react";
import categoryBanner from "../../../../assets/images/category-banner.jpg";
import NavBtns from "../../../Common/Navigation/NavBtns/NavBtns";
import classNames from "classnames";

function ContentWrap() {
  const keywords = [
    "Garden tools",
    "Home decor",
    "Outdoor gardening",
    "Drop shipping",
    "Local deals",
  ];

  return (
    <div
      className={`${styles.contentWrapper} flex flex-col align-center`}
      style={{ backgroundImage: `url(${categoryBanner})` }}
    >
      <h2>Home, Garden & Tools</h2>
      <div className={`${styles.keywordWrap} flex`}>
        <div className={styles.label}>Related Searches:</div>
        <div className={`${styles.keywordList} flex`}>
          {keywords.map((keyword, index) => (
            <Link
              key={index}
              className={styles.kItem}
              to={`/search?q=${keyword}`}
            >
              {keyword}
            </Link>
          ))}
        </div>
        <div className={styles.showMoreBtn}>
          <span>More</span>
          <FaAngleDown />
        </div>
      </div>
    </div>
  );
}

function SubCatList() {
  const subCategoryListRef = useRef(null);

  const subCategories = [
    {
      label: "Garden tools",
      image: "/images/category/image-1.jpg",
    },
    {
      label: "Home decor",
      image: "/images/category/image-2.jpg",
    },
    {
      label: "Outdoor gardening",
      image: "/images/category/image-3.jpg",
    },
    {
      label: "Drop shipping",
      image: "/images/category/image-4.jpg",
    },
    {
      label: "Local deals",
      image: "/images/category/image-5.jpg",
    },
    {
      label: "Garden care",
      image: "/images/category/image-6.jpg",
    },
    {
      label: "Home improvement",
      image: "/images/category/image-7.jpg",
    },

    {
      label: "Home entertainment",
      image: "/images/category/image-8.jpg",
    },
  ];

  const handleScroll = useCallback((direction) => {
    const subListContainer = subCategoryListRef.current;
    const subCatWidth = subListContainer.children[0].clientWidth;

    direction === "next"
      ? (subListContainer.scrollLeft += subCatWidth)
      : (subListContainer.scrollLeft -= subCatWidth);
  }, []);

  return (
    <div className={`${styles.subListWrapper} flex flex-col`}>
      <h3>Source by category</h3>
      <div
        className={`${styles.subList} flex justify-between`}
        ref={subCategoryListRef}
      >
        {subCategories.map((subCat, index) => (
          <Link
            key={index}
            className={`${styles.categoryItem} flex flex-col flex-center`}
          >
            <div className={`${styles.categoryImage} flex flex-center`}>
              <img src={subCat.image} alt="" />
            </div>
            <span className={styles.categoryLabel}>{subCat.label}</span>
          </Link>
        ))}
      </div>
      <NavBtns
        handleNext={() => handleScroll("next")}
        handlePrev={() => handleScroll("prev")}
      />
    </div>
  );
}

function CategoryBanner({ customClass }) {
  return (
    <section
      className={classNames(
        `${styles.categoryBanner} flex flex-col flex-center`,
        {
          [customClass]: customClass,
        }
      )}
    >
      <ContentWrap />
      <SubCatList />
    </section>
  );
}

export default CategoryBanner;
