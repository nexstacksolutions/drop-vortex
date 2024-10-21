import classNames from "classnames";
import styles from "./index.module.css";
import { useState } from "react";

function FilterTabs({ showTabCount = true }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const filterNav = [
    "All",
    "Active",
    "Inactive",
    "Draft",
    "Pending QC",
    "Violation",
    "Deleted",
  ];

  return (
    <div className={`${styles.filterTabs} flex`}>
      {filterNav.map((filter, index) => (
        <button
          key={index}
          className={classNames(styles.filterButton, {
            [styles.activeTab]: activeTab === index,
          })}
          onClick={() => handleTabClick(index)}
        >
          {index === 1 && showTabCount && (
            <span className={`${styles.tabValueCount} flex flex-center`}>
              22
            </span>
          )}
          <span> {filter}</span>
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
