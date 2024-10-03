import styles from "./StatusSidebar.module.css";
import { RxReload } from "react-icons/rx";
import { FaAngleDown } from "react-icons/fa6";
import useMediaExport from "../../../../hooks/useMediaExport";
import { useState } from "react";
import classNames from "classnames";
import Divider from "../../../constant/Divider/Divider";

// Guide component to display a section with title and collapsible items
function StatusGuide({ title, items, onToggle, isActive }) {
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
        <ul className={styles.sectionItems}>
          {items.map((item, index) => (
            <li key={index} className={styles.sectionItem}>
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
  const [activeSection, setActiveSection] = useState(0);

  const statusSections = [
    {
      title: "Basic Information",
      items: ["Add at least 3 main images"],
    },
    {
      title: "Product Specification",
      items: ["Fill mandatory attributes"],
    },
    {
      title: "Price, Stock & Variants",
      items: [],
    },
    {
      title: "Product Description",
      items: [
        "Add at least 1 image in the description",
        "Add at least 30 words in the description",
      ],
    },
    {
      title: "Shipping & Warranty",
      items: [],
    },
  ];

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
              <span className={styles.progressIndicator}></span>
            </div>
            <span className={styles.progressValue}>0%</span>
          </div>
          <h5 className={styles.progressDesc}>Poor</h5>
        </div>
      </header>
      <Divider />
      <div className={`${styles.statusGuide} flex flex-col`}>
        {statusSections.map(({ title, items }, index) => (
          <StatusGuide
            key={index}
            title={title}
            items={items}
            isActive={activeSection === index}
            onToggle={() =>
              setActiveSection(activeSection === index ? null : index)
            }
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
