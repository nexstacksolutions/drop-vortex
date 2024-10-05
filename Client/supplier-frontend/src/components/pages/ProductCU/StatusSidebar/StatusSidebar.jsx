import styles from "./StatusSidebar.module.css";
import classNames from "classnames";
import { RxReload } from "react-icons/rx";
import { FaAngleDown } from "react-icons/fa6";
import Divider from "../../../constant/Divider/Divider";
import useMediaExport from "../../../../hooks/useMediaExport";
import { useProductForm } from "../../../../context/ProductForm";
import useSectionScroll from "../../../../hooks/useSectionScroll";
import useContentScore from "../../../../hooks/useContentScore";
import { useMemo } from "react";
import { get } from "lodash";

// Guide component to display a section with title and collapsible items
function ScoreImproverGuide({ title, guinness, onToggle, isActive }) {
  return (
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
  );
}

// Component to display content status progress and status guides
function ContentStatus() {
  const { state, emptyFields, requiredFields, sectionRefs } = useProductForm();
  const { activeSection, scrollToSection } = useSectionScroll(sectionRefs);
  const { contentScore } = useContentScore(state, emptyFields, requiredFields);

  // Determine content status sections
  const statusSections = useMemo(() => {
    const basicInfoCondition =
      get(state, "basicInfo.media.productImages").length < 3;

    const DescCondition =
      get(state, "description.main.length") < 40 ||
      !get(state, "description.main").includes("img");

    const SpecCondition = () => {
      const fieldsPath = Object.keys(requiredFields).filter((field) =>
        field.includes("specifications")
      );
      const fieldStatus = fieldsPath.map((field) => get(state, field) === "");
      return fieldStatus.includes(true);
    };

    return [
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
          ? [
              "Add at least 1 image in the description",
              "Add at least 30 words in the description",
            ]
          : [],
      },
      { title: "Shipping & Warranty", guinness: [] },
    ];
  }, [state, requiredFields]);

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
                style={{ width: `${contentScore || 2}%` }}
              />
            </div>
            <span className={styles.progressValue}>{contentScore}%</span>
          </div>
          <h5 className={styles.progressDesc}>
            {contentScore < 70
              ? contentScore < 50
                ? "Poor"
                : "To be Improved"
              : contentScore < 90
              ? "Qualified"
              : "Excellent"}
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

// Component to display a card with helpful tips
function TipsCard() {
  const { TipsIcon } = useMediaExport();
  return (
    <div className={`${styles.tipsCard} flex flex-col`}>
      <h3 className={styles.tipsTitle}>Tips</h3>
      <TipsIcon />
      <div className={`${styles.tipsContent} flex flex-col`}>
        <p className={styles.tipsText}>
          Please ensure to upload product images, fill in the product name, and
          select the correct category to publish your product.
        </p>
      </div>
    </div>
  );
}

// Main component for the sidebar that combines content status and tips card
function StatusSidebar({
  showContentStatus = true,
  showTipsCard = true,
  contentStatusProps,
  tipsCardProps,
}) {
  return (
    <aside className={`${styles.statusSidebar} flex flex-col`}>
      {showContentStatus && <ContentStatus {...contentStatusProps} />}
      {showTipsCard && <TipsCard {...tipsCardProps} />}
    </aside>
  );
}

export default StatusSidebar;
