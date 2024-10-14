import styles from "./StatusSidebar.module.css";
import classNames from "classnames";
import { RxReload } from "react-icons/rx";
import { FaAngleDown } from "react-icons/fa6";
import Divider from "../../../constant/Divider/Divider";
import useMediaExport from "../../../../hooks/useMediaExport";
import { useMemo, useCallback, memo, useState, useEffect } from "react";
import {
  useProductFormUI,
  useProductFormState,
} from "../../../../context/ProductForm";

// Memoized Guide Component
const ScoreImproverGuide = memo(({ title, guinness, onToggle, isActive }) => (
  <div
    className={classNames(styles.guideSection, "flex flex-col", {
      [styles.activeSection]: isActive,
    })}
    onClick={onToggle}
  >
    <h4 className={`${styles.sectionTitle} flex align-center`}>
      <span className={styles.activeIndicator}></span>
      <span>{title}</span>
      <FaAngleDown />
    </h4>
    {isActive && (
      <ul className={styles.guideList}>
        {guinness.map((item, index) => (
          <li key={index} className={styles.guideItem}>
            {item}
          </li>
        ))}
      </ul>
    )}
  </div>
));

ScoreImproverGuide.displayName = "ScoreImproverGuide";

// Memoized Content Status Component
const ContentStatus = memo(
  ({
    formState,
    requiredFields,
    activeSection,
    scrollToSection,
    contentScore,
  }) => {
    const basicInfoCondition = useMemo(
      () => formState.basicInfo.media.productImages.length < 3,
      [formState]
    );

    const DescCondition = useMemo(
      () =>
        formState.description.main.length < 40 ||
        !formState.description.main.includes("img"),
      [formState]
    );

    const SpecCondition = useCallback(() => {
      const fieldsPath = Object.keys(requiredFields).filter((field) =>
        field.includes("specifications")
      );
      const fieldStatus = fieldsPath.map((field) => formState[field] === "");
      return fieldStatus.includes(true);
    }, [formState, requiredFields]);

    const statusSections = useMemo(
      () => [
        {
          title: "Basic Information",
          guinness: basicInfoCondition ? ["Add at least 3 main images"] : [],
        },
        {
          title: "Product Specification",
          guinness: SpecCondition() ? ["Fill mandatory attributes"] : [],
        },
        { title: "Price, Stock & Variants", guinness: [] },
        {
          title: "Product Description",
          guinness: DescCondition
            ? ["Add at least 1 image", "Add at least 30 words"]
            : [],
        },
        { title: "Shipping & Warranty", guinness: [] },
      ],
      [basicInfoCondition, SpecCondition, DescCondition]
    );

    const dynamicColor = useMemo(() => {
      if (contentScore < 50) return "var(--danger-color)";
      if (contentScore < 70) return "var(--warning-color)";
      return "var(--success-color)";
    }, [contentScore]);

    const getProgressDesc = useCallback((score) => {
      if (score < 50) return "Poor";
      if (score < 70) return "To be Improved";
      if (score < 99) return "Qualified";
      return "Excellent";
    }, []);

    return (
      <div className={`${styles.contentStatus} flex flex-col`}>
        <header className={`${styles.statusHeader} flex flex-col`}>
          <div className={`${styles.headerContent} flex justify-between`}>
            <h3 className={styles.headerTitle}>Content Score</h3>
            <button
              className={styles.refreshButton}
              aria-label="Refresh Content Score"
            >
              <RxReload />
            </button>
          </div>
          <div className={styles.progressWrapper}>
            <div
              className={`${styles.progressBarContainer} flex justify-between align-center`}
            >
              <div className={`${styles.progressBar} flex align-center`}>
                <span
                  className={styles.progressIndicator}
                  style={{
                    width: `${contentScore || 2}%`,
                    backgroundColor: dynamicColor,
                  }}
                />
              </div>
              <span className={styles.progressValue}>{contentScore}%</span>
            </div>
            <h5 className={styles.progressDesc} style={{ color: dynamicColor }}>
              {getProgressDesc(contentScore)}
            </h5>
          </div>
        </header>
        <Divider />
        <div className={`${styles.statusBody} flex flex-col`}>
          {statusSections.map(({ title, guinness }, index) => (
            <ScoreImproverGuide
              key={index}
              title={title}
              guinness={guinness}
              isActive={activeSection === index}
              onToggle={() => scrollToSection(index)}
            />
          ))}
        </div>
      </div>
    );
  }
);

ContentStatus.displayName = "ContentStatus";

// Memoized Tips Card Component
const TipsCard = memo(({ guideContent, TipsIcon }) => {
  const [contentKey, setContentKey] = useState(0);

  useEffect(() => {
    setContentKey((prevKey) => prevKey + 1);
  }, [guideContent]);

  return (
    <div key={contentKey} className={`${styles.tipsCard} flex flex-col`}>
      <h3 className={styles.tipsTitle}>{guideContent?.title}</h3>
      <TipsIcon />
      <div className={`${styles.tipsContent} flex flex-col`}>
        <p className={styles.tipsText}>{guideContent?.guide}</p>
      </div>
    </div>
  );
});

TipsCard.displayName = "TipsCard";

// Main Sidebar Component
function StatusSidebar() {
  const { formState } = useProductFormState();
  const {
    requiredFields,
    guideContent,
    activeSection,
    scrollToSection,
    contentScore,
  } = useProductFormUI();

  const { TipsIcon } = useMediaExport();

  return (
    <aside className={`${styles.statusSidebar} flex flex-col`}>
      <ContentStatus
        formState={formState}
        requiredFields={requiredFields}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        contentScore={contentScore}
      />
      <TipsCard guideContent={guideContent} TipsIcon={TipsIcon} />
    </aside>
  );
}

export default memo(StatusSidebar);
