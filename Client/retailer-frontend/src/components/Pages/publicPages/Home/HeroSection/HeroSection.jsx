import styles from "./HeroSection.module.css";
import navigation from "../../../../../constant/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import classNames from "classnames";

function NestedCategoryList({ nestedCategories }) {
  return (
    <ul className={`${styles.nestedCategoryList} flex flex-col`}>
      {nestedCategories.map(({ label, subLinks }, idx) => (
        <li
          key={`${label}-${idx}`}
          className={`${styles.nestedCategoryItem} flex flex-col`}
        >
          <NavLink to="/" className={styles.nestedCategoryLink}>
            {label}
          </NavLink>
          {subLinks?.length > 0 && (
            <div className={`${styles.nestedSubLinks} flex flex-wrap`}>
              {subLinks.map(({ path, label }, subIdx) => (
                <NavLink
                  key={`${path}-${subIdx}`}
                  to={path}
                  className={styles.nestedSubLink}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function CategoryList({
  categories,
  onCategoryHover,
  isSubCategory,
  activeCategory,
}) {
  const handleMouseEnter = useCallback(
    (category) => onCategoryHover(category),
    [onCategoryHover]
  );

  return (
    <ul
      className={classNames(`${styles.categoryList} flex flex-col`, {
        [styles.subcategoryList]: isSubCategory,
      })}
    >
      {categories.map(({ label, icon, subLinks }, idx) => {
        const isActive = activeCategory?.label === label;

        return (
          <li
            key={`${label}-${idx}`}
            onMouseEnter={() => handleMouseEnter({ label, icon, subLinks })}
            className={classNames(
              `${styles.categoryItem} flex justify-between align-center`,
              { [styles.categoryItemActive]: isActive }
            )}
          >
            <NavLink
              to="/"
              className={`${styles.categoryLink} flex align-center`}
            >
              {!isSubCategory && icon && <img src={icon} alt={label} />}
              <span>{label}</span>
            </NavLink>
            {!isSubCategory && <FaAngleRight />}
          </li>
        );
      })}
    </ul>
  );
}

function NestedWrap({
  activeSubLinks,
  isSubCategory,
  onCategoryHover,
  activeNestedLinks,
  activeCategory,
}) {
  return (
    <div className={`${styles.nestedWrap} flex`}>
      {isSubCategory && (
        <CategoryList
          isSubCategory={isSubCategory}
          categories={activeSubLinks}
          onCategoryHover={onCategoryHover}
          activeCategory={activeCategory}
        />
      )}
      <NestedCategoryList nestedCategories={activeNestedLinks} />
    </div>
  );
}

function CategorySection() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const { categories } = navigation;

  const handleCategoryHover = useCallback((category) => {
    setHoveredCategory(category);
  }, []);

  const handleSubCategoryHover = useCallback((subCategory) => {
    setHoveredSubCategory(subCategory);
  }, []);

  const hasNestedSubCategories = useMemo(() => {
    return hoveredCategory?.subLinks?.[0]?.subLinks?.[0]?.subLinks;
  }, [hoveredCategory]);

  const currentSubLinks = useMemo(() => {
    return hoveredCategory?.subLinks || [];
  }, [hoveredCategory]);

  const nestedSubLinks = useMemo(() => {
    const defaultSubLinks = hoveredCategory?.subLinks?.[0]?.subLinks;
    return hasNestedSubCategories
      ? hoveredSubCategory?.subLinks || defaultSubLinks || []
      : currentSubLinks;
  }, [
    hasNestedSubCategories,
    hoveredSubCategory,
    hoveredCategory,
    currentSubLinks,
  ]);

  const handleMouseLeave = useCallback(() => {
    setHoveredCategory(null);
    setHoveredSubCategory(null);
  }, []);

  return (
    <aside className={styles.categorySection} onMouseLeave={handleMouseLeave}>
      <CategoryList
        categories={categories}
        onCategoryHover={handleCategoryHover}
        activeCategory={hoveredCategory}
      />
      {(nestedSubLinks.length > 0 || hasNestedSubCategories) && (
        <NestedWrap
          isSubCategory={hasNestedSubCategories}
          activeSubLinks={currentSubLinks}
          activeNestedLinks={nestedSubLinks}
          onCategoryHover={handleSubCategoryHover}
          activeCategory={hoveredSubCategory || hoveredCategory?.subLinks?.[0]}
        />
      )}
    </aside>
  );
}

function BannerSection() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const { bannerList } = navigation;

  const currentBanner = bannerList[currentBannerIndex];
  const handleBannerChange = useCallback(
    (direction) => {
      setCurrentBannerIndex((prev) => {
        return direction === "next"
          ? (prev + 1) % bannerList.length
          : (prev - 1 + bannerList.length) % bannerList.length;
      });
    },
    [bannerList.length]
  );

  const handleNext = useCallback(
    () => handleBannerChange("next"),
    [handleBannerChange]
  );

  const handlePrev = () => handleBannerChange("prev");

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [handleNext, bannerList.length]);

  return (
    <div className={`${styles.bannerSection} flex`}>
      <Link
        to={bannerList[0].path}
        className={styles.featureBanner}
        style={{ backgroundImage: `url(${currentBanner.image})` }}
      ></Link>
    </div>
  );
}

function HeroSection({ customClass }) {
  return (
    <section
      className={classNames(
        `${styles.heroSection} flex justify-between align-start`,
        {
          [customClass]: customClass,
        }
      )}
    >
      <CategorySection />
      <BannerSection />
    </section>
  );
}

export default HeroSection;
