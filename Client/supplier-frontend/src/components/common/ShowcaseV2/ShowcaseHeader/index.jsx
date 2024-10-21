import styles from "./index.module.css";
import classNames from "classnames";
import { memo } from "react";
import Breadcrumbs from "../../Navigation/Breadcrumbs";
import FilterButtons from "../../Navigation/FilterButtons";
import FilterTabs from "../../Navigation/FilterTabs";
import FeatureMsg from "../../FeatureMsg";

function HeaderWrapper({
  showcaseName,
  filterButtonsProps,
  showFilterButtons = false,
}) {
  return (
    <div
      className={`${styles.headerWrapper} flex justify-between align-center`}
    >
      <h2>{showcaseName}</h2>
      {showFilterButtons && <FilterButtons {...filterButtonsProps} />}
    </div>
  );
}

function ShowcaseHeader({
  customClass,
  showBreadcrumbs = true,
  showFeatureMsg = true,
  showFilterTabs = true,
  headerWrapperProps,
  featureMsgProps,
  breadcrumbsProps,
  filterTabsProps,
}) {
  return (
    <section
      className={classNames(styles.showcaseHeader, "flex flex-col ", {
        [customClass]: customClass,
      })}
    >
      {showBreadcrumbs && <Breadcrumbs {...breadcrumbsProps} />}
      <HeaderWrapper {...headerWrapperProps} />
      {showFeatureMsg && <FeatureMsg {...featureMsgProps} />}
      {showFilterTabs && <FilterTabs {...filterTabsProps} />}
    </section>
  );
}

export default memo(ShowcaseHeader);
