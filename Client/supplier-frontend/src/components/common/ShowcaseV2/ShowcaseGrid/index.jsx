import styles from "./index.module.css";
import { memo } from "react";
import ShowcaseHeader from "../ShowcaseHeader";
import ShowcaseContent from "../ShowcaseContent";
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
