import styles from "./ShowcaseGrid.module.css";
import { memo } from "react";
import ShowcaseHeader from "../ShowcaseHeader/ShowcaseHeader";
import ShowcaseContent from "../ShowcaseContent/ShowcaseContent";
import classNames from "classnames";

function ShowcaseGrid({
  customClass,
  showShowcaseHeader = true,
  showShowcaseContent = true,
  showcaseHeaderProps,
  showcaseContentProps,
}) {
  return (
    <section
      className={classNames(styles.showcaseGrid, "flex flex-col", {
        [customClass]: customClass,
      })}
    >
      {showShowcaseHeader && <ShowcaseHeader {...showcaseHeaderProps} />}
      {showShowcaseContent && <ShowcaseContent {...showcaseContentProps} />}
    </section>
  );
}

export default memo(ShowcaseGrid);
